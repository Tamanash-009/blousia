/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reusable Luxury UserAddress Form with Google Places Autocomplete Integration
 * and GPS Auto-Fill capabilities.
 */

import React, { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin, Sparkles, Navigation, Check, AlertCircle, Info, Phone, User, Home, Briefcase, FileText } from "lucide-react";

interface UserAddressProps {
  onSubmit: (address: {
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    type: string;
  }) => void;
  onCancel: () => void;
  initialValues?: {
    fullName?: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    type?: string;
  };
  submitLabel?: string;
}

export const UserAddress: React.FC<UserAddressProps> = ({
  onSubmit,
  onCancel,
  initialValues = {} as NonNullable<UserAddressProps["initialValues"]>,
  submitLabel = "Save Address"
}) => {
  // Form fields state
  const [fullName, setFullName] = useState(initialValues.fullName || "");
  const [phone, setPhone] = useState(initialValues.phone || "");
  const [streetAddress, setStreetAddress] = useState(initialValues.streetAddress || "");
  const [city, setCity] = useState(initialValues.city || "");
  const [state, setState] = useState(initialValues.state || "");
  const [postalCode, setPostalCode] = useState(initialValues.postalCode || "");
  const [addrType, setAddrType] = useState(initialValues.type || "Home");

  // Auxiliary UI state
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [autocompleteActive, setAutocompleteActive] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Google Places references
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);

  // Check if API key is injected
  const hasMapsApiKey = Boolean(
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY
  );

  // Initialize Autocomplete
  useEffect(() => {
    if (!placesLibrary || !autocompleteInputRef.current) {
      if (!placesLibrary && hasMapsApiKey) {
        console.log("Google Places Library is loading...");
      }
      return;
    }

    try {
      // Configuration for precise address components retrieval
      const options: google.maps.places.AutocompleteOptions = {
        fields: ["address_components", "formatted_address", "geometry", "name"],
        types: ["address"],
        componentRestrictions: { country: "IN" } // Prioritize India for Blousia Boutique
      };

      const instance = new placesLibrary.Autocomplete(autocompleteInputRef.current, options);
      setAutocompleteInstance(instance);
      setAutocompleteActive(true);

      // Listener for place changes
      const listener = instance.addListener("place_changed", () => {
        const place = instance.getPlace();
        if (!place || !place.address_components) return;

        let streetNumber = "";
        let route = "";
        let sublocality = "";
        let extractedLocality = "";
        let extractedDistrict = "";
        let extractedState = "";
        let extractedPincode = "";

        // Loop through components to gather precise details
        for (const component of place.address_components) {
          const types = component.types;
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          } else if (types.includes("route")) {
            route = component.long_name;
          } else if (types.includes("sublocality") || types.includes("sublocality_level_1") || types.includes("neighborhood")) {
            sublocality = component.long_name;
          } else if (types.includes("locality")) {
            extractedLocality = component.long_name;
          } else if (types.includes("administrative_area_level_2")) {
            extractedDistrict = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            extractedState = component.long_name;
          } else if (types.includes("postal_code")) {
            extractedPincode = component.long_name;
          }
        }

        // Combine street elements beautifully
        const streetElements = [streetNumber, route, sublocality].filter(Boolean);
        const derivedStreet = streetElements.length > 0 
          ? streetElements.join(", ") 
          : place.name || "";

        setStreetAddress(derivedStreet);
        setCity(extractedLocality || extractedDistrict || "");
        setState(extractedState);
        if (extractedPincode) {
          setPostalCode(extractedPincode.replace(/\D/g, "").slice(0, 6));
        }

        setGpsMessage({
          type: "success",
          text: `Verified via Google Autocomplete: ${place.name || "Location resolved"}`
        });
      });

      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (err) {
      console.error("Failed to initialize Google Autocomplete", err);
      setAutocompleteActive(false);
    }
  }, [placesLibrary, hasMapsApiKey]);

  // GPS Auto-Fill fallback
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage({ type: "error", text: "Geolocation is not supported by your browser." });
      return;
    }
    
    setIsDetectingLocation(true);
    setGpsMessage({ type: "info", text: "Acquiring precise satellite coordinates..." });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            const fetchedCity = addr.city || addr.town || addr.village || addr.suburb || addr.city_district || "";
            const fetchedState = addr.state || "";
            const fetchedPostal = addr.postcode || "";
            const fetchedRoad = addr.road || addr.suburb || addr.neighbourhood || "";
            
            setStreetAddress(fetchedRoad);
            setCity(fetchedCity);
            setState(fetchedState);
            if (fetchedPostal) {
              setPostalCode(fetchedPostal.replace(/\D/g, "").slice(0, 6));
            }
            setGpsMessage({ type: "success", text: "Coordinates synced! Location details auto-filled." });
          } else {
            setCity("Mumbai");
            setState("Maharashtra");
            setPostalCode("400001");
            setGpsMessage({ type: "info", text: "Approximate location details populated." });
          }
        } catch (error) {
          console.error("Geocoding coordinates failed", error);
          setCity("Mumbai");
          setState("Maharashtra");
          setPostalCode("400001");
          setGpsMessage({ type: "error", text: "GPS reverse resolution failed, defaulted to Mumbai." });
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("GPS coordinates blocked", error);
        setIsDetectingLocation(false);
        setCity("Mumbai");
        setState("Maharashtra");
        setPostalCode("400001");
        setGpsMessage({ type: "error", text: "GPS permissions denied or unavailable. Fields defaulted." });
      }
    );
  };

  // Indian pincode fallback API lookup when user manually inputs postal code
  const handlePincodeLookup = async (pin: string) => {
    const cleanedPin = pin.replace(/\D/g, "").slice(0, 6);
    setPostalCode(cleanedPin);
    if (cleanedPin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanedPin}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District || postOffice.Block || "");
          setState(postOffice.State || "");
          setGpsMessage({ type: "success", text: `PIN resolved: ${postOffice.Name || postOffice.District}` });
        }
      } catch (err) {
        console.error("PIN code details lookup failed", err);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && phone.trim() && streetAddress.trim() && city.trim() && state.trim() && postalCode.trim()) {
      onSubmit({
        fullName: fullName.trim(),
        phone: phone.trim(),
        streetAddress: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        type: addrType
      });
    }
  };

  return (
    <form 
      onSubmit={handleFormSubmit} 
      className="rounded-3xl border border-dashed border-gold-300 p-6 bg-[#FCFBF8] space-y-5 animate-fadeIn dark:bg-slate-900/60 dark:border-slate-800"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-1 border-b border-gold-200/20">
        <div>
          <h4 className="font-serif text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <MapPin size={16} className="text-gold-500" /> shipping destination details
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5">Please specify precise delivery coordinates for customized blouse fitments.</p>
        </div>

        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetectingLocation}
          className="text-[10px] font-bold text-gold-600 hover:text-gold-700 hover:underline flex items-center gap-1 cursor-pointer bg-gold-100/30 px-2.5 py-1 rounded-full dark:bg-slate-800 dark:text-gold-400"
        >
          <Navigation size={10} className={isDetectingLocation ? "animate-spin" : ""} />
          {isDetectingLocation ? "Syncing coordinates..." : "satellite auto-fill"}
        </button>
      </div>

      {/* Autocomplete Service Status Information Box */}
      {hasMapsApiKey ? (
        autocompleteActive ? (
          <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-2.5 flex items-start gap-2 text-[10px] text-emerald-800 dark:text-emerald-400">
            <Sparkles size={13} className="text-emerald-500 mt-0.5 shrink-0" />
            <p>
              <strong className="font-bold">Google Smart Autocomplete is live!</strong> Just start typing your building, flat, or street in the address bar below to instantly verify details.
            </p>
          </div>
        ) : (
          <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-2.5 flex items-start gap-2 text-[10px] text-amber-800 dark:text-amber-400">
            <Info size={13} className="text-amber-500 mt-0.5 shrink-0" />
            <p>Loading Google Places verification services... Manual entry is available below.</p>
          </div>
        )
      ) : (
        <div className="bg-[#FAF7F2] dark:bg-slate-950 border border-gold-200/40 rounded-xl p-3 text-[10px] text-gray-600 dark:text-gray-400 space-y-1.5">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-gold-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-gray-800 dark:text-white">Want real-time Google address verification?</p>
              <p className="leading-relaxed">Configure the Google Maps API Key in AI Studio Secrets to unlock predictive auto-filling as you type.</p>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900 p-2 border border-black/[0.03] text-[9px] text-gray-500 leading-normal font-sans">
            <span className="font-bold block text-gold-600">To unlock Google Autocomplete:</span>
            1. Open <strong className="font-bold">Settings (⚙️)</strong> in top-right corner &rarr; <strong className="font-bold">Secrets</strong><br />
            2. Type <code className="font-mono bg-gray-100 dark:bg-slate-850 px-1 py-0.5 rounded text-gray-800 dark:text-white">GOOGLE_MAPS_PLATFORM_KEY</code> as name<br />
            3. Paste your API key & press Enter. The boutique will automatically compile & run Google Verification!
          </div>
        </div>
      )}

      {/* Interactive feedback alert */}
      {gpsMessage && (
        <div className={`p-2.5 rounded-xl border flex items-start gap-2 text-[10px] animate-fadeIn ${
          gpsMessage.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/20"
            : gpsMessage.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950/10 dark:text-rose-400 dark:border-rose-900/20"
              : "bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-950/10 dark:text-blue-400 dark:border-blue-900/20"
        }`}>
          {gpsMessage.type === "success" ? <Check size={13} className="mt-0.5 shrink-0 text-emerald-500" /> : <AlertCircle size={13} className="mt-0.5 shrink-0" />}
          <p className="font-medium">{gpsMessage.text}</p>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="space-y-3 text-xs">
        {/* Recipient Identity fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
              <User size={10} className="text-gold-500" /> Receiver Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Radhika Deshmukh"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-950 bg-white focus:ring-1 focus:ring-gold-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
              <Phone size={10} className="text-emerald-500" /> Phone Number (For delivery coordination)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-950 bg-white focus:ring-1 focus:ring-gold-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {/* Real-time Google Autocomplete Street Address Input */}
        <div className="space-y-1">
          <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <MapPin size={10} className="text-rose-500" /> Flat, House No, Building / Google search
          </label>
          <input
            ref={autocompleteInputRef}
            type="text"
            required
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Search address using Google Autocomplete or type manually..."
            className="w-full rounded-xl border border-gold-200 px-3.5 py-2.5 text-xs font-medium text-gray-950 bg-white focus:ring-1 focus:ring-gold-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* City, State, PIN Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[9px]">City / Locality</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-950 bg-white focus:ring-1 focus:ring-gold-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[9px]">State</label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Maharashtra"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-950 bg-white focus:ring-1 focus:ring-gold-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[9px] flex items-center justify-between">
              <span>PIN (6 Digits)</span>
              <span className="text-[7px] font-bold text-gold-600 bg-gold-50 dark:bg-slate-800 px-1 py-0.2 rounded">Verify PIN</span>
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={postalCode}
              onChange={(e) => handlePincodeLookup(e.target.value)}
              placeholder="e.g. 400001"
              className="w-full rounded-xl border border-gold-300 bg-gold-50/5 px-3.5 py-2.5 text-xs font-bold text-gray-950 focus:ring-1 focus:ring-gold-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              title="Type 6 digits for Indian Postal API resolution"
            />
          </div>
        </div>

        {/* Address Type Select */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Destination Category</label>
          <div className="flex gap-2">
            {[
              { id: "Home", icon: <Home size={12} />, label: "Home / Residence" },
              { id: "Work", icon: <Briefcase size={12} />, label: "Work / Office" },
              { id: "Other", icon: <FileText size={12} />, label: "Other / Custom Address" }
            ].map((typeOption) => (
              <button
                key={typeOption.id}
                type="button"
                onClick={() => setAddrType(typeOption.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  addrType === typeOption.id
                    ? "border-gold-500 bg-gold-500 text-white shadow-xs dark:bg-gold-600 dark:border-gold-600"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-950 dark:text-gray-300 dark:hover:bg-slate-900"
                }`}
              >
                {typeOption.icon}
                {typeOption.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex gap-3 justify-end pt-3 border-t border-black/[0.04]">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer dark:border-slate-800 dark:bg-slate-950 dark:text-gray-400 dark:hover:bg-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gold-500 hover:bg-gold-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all tracking-wider uppercase cursor-pointer dark:bg-gold-600 dark:hover:bg-gold-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
