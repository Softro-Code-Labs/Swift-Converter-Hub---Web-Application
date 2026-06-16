'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Shield,
  CheckCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { TOPICS, FAQS } from '../constants/constants';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const canSubmit =
    selectedTopic && name.trim() && email.trim() && message.trim();

  const selectedTopicData = TOPICS.find((t) => t.id === selectedTopic);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          topic: selectedTopic,
        }),
      });

      toast.success('Message sent successfully.');
      if (!res.ok) {
        toast.error('Something went wrong. Please try again.');
      }

      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Back link ───────────────────────────────────────────────── */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">
            <Mail className="w-3 h-3" />
            Get in touch
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How can we help?
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            Report a bug, suggest a feature, or ask anything about our tools. We
            typically respond within 1–2 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ── Left — contact form ─────────────────────────────────── */}
          <div className="space-y-5">
            {/* Success state */}
            {status === 'sent' ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Message sent!
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Thanks {name.split(' ')[0]}. We'll get back to you at{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {email}
                    </span>{' '}
                    within 1–2 business days.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setName('');
                    setEmail('');
                    setMessage('');
                    setSelectedTopic('');
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Topic selector */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      What's this about?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800">
                    {TOPICS.map((topic) => {
                      const Icon = topic.icon;
                      const isSelected = selectedTopic === topic.id;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSelectedTopic(topic.id)}
                          className={`flex items-center gap-3 p-4 text-left cursor-pointer transition-all
                            ${
                              isSelected
                                ? `${topic.selectedBg} border-2 ${topic.border}`
                                : 'bg-white dark:bg-slate-900 border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${topic.color}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {topic.label}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                              {topic.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-blue-500 ml-auto shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form fields */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Your details
                    </p>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          selectedTopicData?.id === 'bug'
                            ? 'Describe the issue — what format were you converting, what happened, and what browser are you using?'
                            : selectedTopicData?.id === 'feature'
                              ? "Describe the feature or improvement you'd like to see..."
                              : 'Write your message here...'
                        }
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all resize-none"
                      />
                      <p className="text-[10px] text-slate-400 dark:text-slate-600 text-right">
                        {message.length} characters
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!canSubmit || status === 'sending'}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all
                        ${
                          canSubmit && status !== 'sending'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] shadow-sm shadow-blue-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 !cursor-not-allowed'
                        }`}
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send message
                        </>
                      )}
                    </button>

                    {!canSubmit && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center">
                        Select a topic and fill in all fields to continue
                      </p>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* ── Right — info sidebar ─────────────────────────────────── */}
          <div className="space-y-5">
            {/* Direct email */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Direct contact
              </h3>
              <a
                href="mailto:hello@swiftconverterhub.com"
                className="flex items-center gap-3 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    hello@swiftconverterhub.com
                  </p>
                  <p className="text-[10px] text-slate-400">
                    General enquiries
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 ml-auto group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </a>
              <a
                href="mailto:privacy@swiftconverterhub.com"
                className="flex items-center gap-3 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    privacy@swiftconverterhub.com
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Privacy & data questions
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 ml-auto group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>

            {/* Response time */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  We're available
                </p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We aim to respond to all messages within{' '}
                <strong className="text-slate-700 dark:text-slate-300">
                  1–2 business days
                </strong>
                . Bug reports are prioritised.
              </p>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Quick answers
                </p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {FAQS.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-start justify-between gap-3 px-5 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                        {faq.q}
                      </p>
                      <span
                        className={`text-slate-400 text-xs shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                      >
                        ▾
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/about"
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read how our tools work
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
