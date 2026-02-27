import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="mb-6 mt-12 first:mt-0"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </motion.div>
  );
}
