/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SAMPLE_BLOGS } from "../data/products";
import { Calendar, User, ArrowLeft, Bookmark, Sparkles, BookOpen } from "lucide-react";

export const FashionBlog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  if (selectedPost) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Style Diaries
        </button>

        <article className="space-y-6">
          <div className="space-y-2">
            <span className="rounded bg-gold-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-700 dark:bg-gold-950 dark:text-gold-300">
              {selectedPost.category}
            </span>
            <h1 className="font-serif text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
              {selectedPost.title}
            </h1>
            
            <div className="flex gap-4 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1"><Calendar size={13} /> {selectedPost.date}</span>
              <span className="flex items-center gap-1"><User size={13} /> By {selectedPost.author}</span>
            </div>
          </div>

          <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gray-50">
            <img src={selectedPost.image} alt={selectedPost.title} className="h-full w-full object-cover" />
          </div>

          <div className="font-sans text-sm leading-relaxed text-gray-600 dark:text-gray-300 space-y-4">
            <p className="font-semibold text-gray-900 dark:text-white text-base">
              {selectedPost.excerpt}
            </p>
            
            {/* Split full text by double-newline to render beautiful paragraphs */}
            {selectedPost.content.split("\n\n").map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Premium Designer Quote Card */}
          <div className="rounded-2xl border-l-4 border-gold-400 bg-gold-50/20 p-5 dark:bg-slate-900">
            <p className="font-serif text-sm italic text-gray-700 dark:text-gray-300">
              "A blouse is not a mere accessory to a saree; it is the structural support system that grounds the outfit's visual energy."
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gold-600">
              — Blousia Senior Couturier Team
            </p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center space-y-2 mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100/50 px-3 py-1 text-xs font-semibold text-gold-700">
          <BookOpen size={12} /> The Style Diaries
        </span>
        <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
          Sartorial Inspiration & Guides
        </h2>
        <p className="mx-auto max-w-md text-xs text-gray-500">
          Unlock the secrets of traditional weavings, neckline architecture, and luxury draping guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_BLOGS.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all hover:border-gold-200 hover:shadow-lg dark:border-slate-900 dark:bg-slate-900"
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-gray-50">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col p-5 space-y-3">
              <span className="self-start rounded bg-gold-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-700 dark:bg-gold-950/40">
                {post.category}
              </span>
              
              <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-gold-500 transition-colors line-clamp-2 dark:text-white">
                {post.title}
              </h3>
              
              <p className="flex-1 text-xs text-gray-500 line-clamp-3 leading-relaxed dark:text-gray-400">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] text-gray-400 dark:border-slate-800">
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                <span className="font-semibold text-gold-500 group-hover:underline">Read Guide</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
