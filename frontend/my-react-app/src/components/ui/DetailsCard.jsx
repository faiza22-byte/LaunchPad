import { AnimatePresence, motion } from "framer-motion";

export default function DetailsCard({
  title,
  children,
  sectionKey,
  Icon,
  openSections,
  toggleSection,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
      className="rounded-3xl p-6 mb-5 cursor-pointer transition-all duration-300 bg-white shadow-sm"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-gray-700" size={24} />}
          {/* Plain heading text */}
          <h3 className="font-semibold text-lg md:text-xl text-gray-900">{title}</h3>
        </div>
        <motion.span
          animate={{ rotate: openSections[sectionKey] ? 180 : 0 }}
          className="text-gray-400 font-bold transition-transform"
        >
          ▼
        </motion.span>
      </div>
      <AnimatePresence>
        {openSections[sectionKey] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}