'use client';

import Link from 'next/link';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import companiesData from '@/lib/companies.json';

type Company = {
  name: string;
  products: string;
  industry: string;
  city: string;
};

type NavLink = {
  href: string;
  label: string;
  variant: 'primary' | 'neutral';
  external?: boolean;
};

// ── Animation Variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] },
  },
};

const filterVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.3 },
  }),
};

const statVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

// ── CountUp Hook ──
function useCountUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

// ── Stats Section ──
function StatsBar() {
  const { count: companyCount, ref: companyRef } = useCountUp(
    companiesData.total,
    2000
  );
  const { count: industryCount, ref: industryRef } = useCountUp(
    companiesData.industries.length,
    1800
  );
  const allCompanies = useMemo(
    () =>
      Object.values(companiesData.data).flat() as Company[],
    []
  );
  const cities = useMemo(
    () => [...new Set(allCompanies.map((c) => c.city).filter(Boolean))],
    [allCompanies]
  );
  const { count: cityCount, ref: cityRef } = useCountUp(cities.length, 1600);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-12"
    >
      {[
        { label: '精选企业', value: companyCount, ref: companyRef },
        { label: '覆盖行业', value: industryCount, ref: industryRef },
        { label: '所在城市', value: cityCount, ref: cityRef },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={statVariants}
          custom={i}
          className="text-center"
        >
          <span
            ref={stat.ref as React.RefObject<HTMLSpanElement>}
            className="text-3xl md:text-4xl font-mono font-medium text-primary-600 block"
          >
            {stat.value}
          </span>
          <span className="text-sm text-neutral-500 mt-1 block">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Main Page ──
export default function Home() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const navLinks: NavLink[] = [
    {
      href: '/sponsor',
      label: '赞助',
      variant: 'primary',
    },
    {
      href: 'https://docs.qq.com/form/page/DU3VxQUtncGNtRmZa',
      label: '建议',
      variant: 'neutral',
      external: true,
    },
    {
      href: '/contact-developer',
      label: '联系开发者',
      variant: 'neutral',
    },
    {
      href: 'https://docs.qq.com/form/page/DU3F6bmxJZFBPSXh0',
      label: '新增企业',
      variant: 'neutral',
      external: true,
    },
  ];

  // Scroll detection for navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const industries = companiesData.industries || [];

  // Compute all unique cities from data
  const allCompanies = useMemo(
    () =>
      Object.values(companiesData.data).flat() as Company[],
    []
  );
  const cities = useMemo(
    () =>
      [...new Set(allCompanies.map((c) => c.city).filter(Boolean))].sort(),
    [allCompanies]
  );

  // Filtered data for table
  const filteredCompanies = useMemo(() => {
    const data = companiesData.data as Record<string, Company[]>;
    let companies: Company[] = [];

    if (selectedIndustry) {
      companies = data[selectedIndustry] || [];
    } else {
      Object.values(data).forEach((items) => {
        companies = companies.concat(items);
      });
    }

    if (selectedCity) {
      companies = companies.filter((c) => c.city === selectedCity);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      companies = companies.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.products.toLowerCase().includes(term) ||
          c.city.toLowerCase().includes(term)
      );
    }

    return companies;
  }, [selectedIndustry, selectedCity, searchTerm]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    },
    []
  );

  const handleIndustryChange = useCallback((industry: string | null) => {
    setSelectedIndustry(industry);
    setSelectedCity(null);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#FFFAF5] via-[#FFFDF9] to-white"
      onKeyDown={handleKeyDown}
    >
      {/* ── Decorative Background Elements ── */}
      <div className="fixed top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/3 blur-3xl" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-secondary-500/4 blur-3xl" />
        <div className="absolute top-80 left-0 w-[300px] h-[300px] rounded-full bg-accent-500/3 blur-3xl" />

        {/* SVG wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-48 text-primary-50/40"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,138.7C672,149,768,139,864,122.7C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* ── Navigation ── */}
        <nav
          className={`sticky top-0 z-50 transition-all duration-500 ${
            scrolled
              ? 'backdrop-blur-xl bg-white/80 border-b border-primary-100/30 shadow-sm'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center"
                >
                  <img
                    src="/gogo_logo_header.svg"
                    alt="gogo logo"
                    className="block h-10 w-auto shrink-0 object-contain"
                  />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="hidden md:flex items-center justify-end gap-2 lg:gap-3 flex-wrap"
              >
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-3 py-2 rounded-full border bg-white/80 text-xs lg:text-sm font-semibold shadow-sm transition-all duration-300 ${
                        link.variant === 'primary'
                          ? 'border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
                      }`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-full border bg-white/80 text-xs lg:text-sm font-semibold shadow-sm transition-all duration-300 ${
                        link.variant === 'primary'
                          ? 'border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </motion.div>

              <button
                type="button"
                aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="md:hidden inline-flex h-10 min-w-20 px-4 items-center justify-center rounded-full border border-primary-200 bg-white/90 text-sm font-semibold text-primary-700 shadow-sm transition-colors hover:bg-primary-50"
              >
                {mobileMenuOpen ? '关闭' : '更多'}
              </button>
            </div>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="md:hidden mt-3 grid grid-cols-2 gap-2"
                >
                  {navLinks.map((link) =>
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-xl border bg-white/95 px-3 py-2.5 text-center text-sm font-semibold shadow-sm transition-colors ${
                          link.variant === 'primary'
                            ? 'border-primary-200 text-primary-700 hover:bg-primary-50'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-xl border bg-white/95 px-3 py-2.5 text-center text-sm font-semibold shadow-sm transition-colors ${
                          link.variant === 'primary'
                            ? 'border-primary-200 text-primary-700 hover:bg-primary-50'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
        {/* ── Hero Section ── */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-neutral-900 mb-5 leading-[1.05] tracking-tight"
            >
              双休购! 用消费力
              <span
                className="font-black bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500
                           bg-clip-text text-transparent bg-[length:200%_auto]
                           animate-[gradientShift_4s_ease_infinite]"
              >
                投票
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg font-semibold text-neutral-700 max-w-xl mx-auto mb-6 leading-relaxed tracking-wide"
            >
              支持守规矩的企业
              <br className="hidden md:block" />
              让每一次消费都更有意义
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <span className="text-sm text-neutral-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary-400" />
                严格筛选入驻
              </span>
              <span className="text-sm text-neutral-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-secondary-400" />
                数据公开透明
              </span>
              <span className="text-sm text-neutral-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent-400" />
                持续更新
              </span>
            </motion.div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative group">
              <div
                className="absolute -inset-1 bg-gradient-to-r from-primary-200/50 via-accent-200/50
                            to-secondary-200/50 rounded-2xl blur-xl opacity-0
                            group-focus-within:opacity-100 transition-all duration-500"
              />
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="搜索企业名称、产品或城市..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-neutral-200
                             bg-white/90 backdrop-blur-sm
                             placeholder:text-neutral-400
                             focus:border-primary-500 focus:outline-none
                             focus:shadow-[0_0_0_4px_rgba(61,173,138,0.1)]
                             transition-all duration-300 text-base"
                />
                {/* Search icon */}
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* Clear button */}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Industry + City Filters ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-6"
          >
            {/* Industry filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <motion.button
                variants={filterVariants}
                custom={0}
                onClick={() => handleIndustryChange(null)}
                className={`px-3.5 py-1.5 rounded-full font-semibold text-[11px] leading-none transition-all duration-300
                  ${
                    selectedIndustry === null
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-200/50 scale-105'
                      : 'bg-white border-2 border-neutral-200 text-neutral-600 hover:border-primary-300 hover:bg-primary-50'
                  }`}
              >
                全部
              </motion.button>
              {industries.map((industry, i) => {
                return (
                  <motion.button
                    key={industry}
                    variants={filterVariants}
                      custom={i + 1}
                      onClick={() => handleIndustryChange(industry)}
                    className={`px-3.5 py-1.5 rounded-full font-semibold text-[11px] leading-none transition-all duration-300 whitespace-nowrap
                      ${
                        selectedIndustry === industry
                          ? 'bg-secondary-500 text-neutral-900 shadow-md shadow-secondary-200/50 scale-105'
                          : 'bg-white border-2 border-neutral-200 text-neutral-600 hover:border-secondary-300 hover:bg-secondary-50'
                      }`}
                  >
                    {industry}
                  </motion.button>
                );
              })}
            </div>

            {/* City filter (only when industry is selected) */}
            {selectedIndustry && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                <button
                  onClick={() => setSelectedCity(null)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-[12px] md:text-[14px] font-medium leading-none transition-all duration-300
                    ${
                      selectedCity === null
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-white border border-neutral-200 text-neutral-500 hover:border-primary-200'
                    }`}
                >
                  ????
                </button>
                {cities.map((city) => {
                  const count = filteredCompanies.filter(
                    (c) => c.city === city
                  ).length;
                  if (count === 0) return null;
                    return (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-[12px] md:text-[14px] font-medium leading-none transition-all duration-300
                        ${
                          selectedCity === city
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-white border border-neutral-200 text-neutral-500 hover:border-primary-200'
                        }`}
                    >
                      {city} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ── Result count ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="text-center mb-6"
          >
            <p className="text-sm text-neutral-500">
              {(searchTerm || selectedIndustry || selectedCity) && (
                <>
                  找到匹配企业
                </>
              )}
            </p>
          </motion.div>

          {/* ── Company Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="min-w-[560px] md:min-w-[680px] w-full table-fixed text-left">
                <colgroup>
                  <col className="w-[24%] md:w-[25%]" />
                  <col className="w-[26%] md:w-[24%]" />
                  <col className="w-[22%] md:w-[20%]" />
                  <col className="w-[28%] md:w-[18%]" />
                  <col className="hidden md:table-column md:w-[13%]" />
                </colgroup>
                <thead>
                  <tr className="bg-gradient-to-r from-primary-50/80 to-accent-50/80 border-b border-neutral-200">
                    <th className="px-2.5 py-3 md:px-5 md:py-4 font-semibold text-neutral-700 text-xs sm:text-sm text-center whitespace-nowrap">
                      企业名称
                    </th>
                    <th className="px-2.5 py-3 md:px-5 md:py-4 font-semibold text-neutral-700 text-xs sm:text-sm text-center whitespace-nowrap">
                      主营产品
                    </th>
                    <th className="px-2.5 py-3 md:px-5 md:py-4 font-semibold text-neutral-700 text-xs sm:text-sm text-center whitespace-nowrap">
                      行业
                    </th>
                    <th className="px-2.5 py-3 md:px-5 md:py-4 font-semibold text-neutral-700 text-xs sm:text-sm whitespace-nowrap">
                      城市
                    </th>
                    <th className="hidden md:table-cell px-2.5 py-3 md:px-5 md:py-4 font-semibold text-neutral-700 text-xs sm:text-sm text-center whitespace-nowrap">
                      认证
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((company, idx) => (
                        <motion.tr
                          key={`${company.name}-${company.city}-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{
                            duration: 0.25,
                            delay: Math.min(idx * 0.015, 0.6),
                          }}
                          className="border-b border-neutral-100/80
                                     hover:bg-primary-50/40 hover:border-l-2 hover:border-l-primary-500
                                     transition-all duration-200 group"
                        >
                          <td className="px-2.5 py-3 md:px-5 md:py-3.5 text-center align-middle">
                            <span className="font-semibold text-neutral-900 text-xs sm:text-sm whitespace-nowrap">
                              {company.name}
                            </span>
                          </td>
                          <td className="px-2.5 py-3 md:px-5 md:py-3.5 text-center align-middle">
                            <span className="text-neutral-600 text-xs sm:text-sm leading-relaxed block truncate text-center">
                              {company.products}
                            </span>
                          </td>
                          <td className="px-2.5 py-3 md:px-5 md:py-3.5 text-center align-middle">
                            <span className="inline-block px-2 py-1 md:px-2.5 rounded-full bg-primary-50 text-primary-600 text-xs sm:text-sm font-semibold whitespace-nowrap border border-primary-100">
                              {company.industry}
                            </span>
                          </td>
                          <td className="px-2.5 py-3 md:px-5 md:py-3.5 align-middle">
                            <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-neutral-500 whitespace-nowrap">
                              <svg
                                className="w-3.5 h-3.5 shrink-0 text-neutral-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                />
                              </svg>
                              {company.city}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-2.5 py-3 md:px-5 md:py-3.5 text-center align-middle">
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full
                                           bg-green-50 text-green-500 text-xs font-bold"
                                title="双休保障"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                              </span>
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full
                                           bg-blue-50 text-blue-500 text-xs font-bold"
                                title="五险一金"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={5} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <svg
                              className="w-12 h-12 text-neutral-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            <p className="font-semibold text-neutral-500">
                              未找到匹配的企业
                            </p>
                            <p className="text-sm text-neutral-400">
                              试试调整搜索条件或选择其他行业
                            </p>
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setSelectedIndustry(null);
                                setSelectedCity(null);
                              }}
                              className="mt-2 px-4 py-2 rounded-lg bg-primary-50 text-primary-600
                                         text-sm font-medium hover:bg-primary-100 transition-colors"
                            >
                              重置筛选
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── Pagination hint ── */}
          {filteredCompanies.length > 50 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 text-center"
            >
              <p className="text-sm text-neutral-400">
                显示 {filteredCompanies.length} 家企业
                {filteredCompanies.length > 100 &&
                  ' · 使用搜索或行业筛选缩小范围'}
              </p>
            </motion.div>
          )}
        </section>

        {/* ── Bottom Section: Mission ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
        >
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 mx-auto mb-8 rounded-full" />
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-4">
              愿望
            </h3>
            <p className="text-neutral-500 leading-relaxed max-w-xl mx-auto">
              双休购倡导健康职场价值，手动选入驻企业，全体公开监督评价上榜企业是否严格执行足额五险与双休。
              用购买力支持守规矩的企业，
              让每一次消费都更有意义。
            </p>
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="border-t border-neutral-200/50 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-neutral-700">
              <Link href="/sponsor" className="transition-colors hover:text-primary-700">
                赞助
              </Link>
              <span className="text-neutral-300">|</span>
              <Link
                href="/contact-developer"
                className="transition-colors hover:text-primary-700"
              >
                联系开发者
              </Link>
              <span className="text-neutral-300">|</span>
              <a
                href="https://sxgo.cc/contact-developer"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary-700"
              >
                加入社群
              </a>
              <span className="text-neutral-300">|</span>
              <a
                href="https://github.com/daxian-w/dx-sxgo"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary-700"
              >
                Github
              </a>
            </div>
            <p className="mt-4 text-xs text-neutral-300">@大仙在玩数码 发起的公益项目</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
