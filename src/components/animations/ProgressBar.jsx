import { motion } from "framer-motion";
const ProgressBar = ({ progress, children }) => {

    const progressBarVariants = {
        initial: { width: 0 },
        animate: {
            width: `${progress}%`,
            transition: {
                duration: 3,
                ease: "easeInOut"
            }
        }
    };


    return (
        <motion.div
        initial="initial"
        variants={progressBarVariants}
        whileInView={"animate"}
        viewport={{ once: true }}
        >
        <p className="bg-white h-2 rounded-full transition-all duration-300">{children}</p>
        </motion.div>
    )
}

export default ProgressBar;

