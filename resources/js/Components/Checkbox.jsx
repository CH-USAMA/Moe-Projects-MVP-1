export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-lg border-gray-300 dark:border-white/10 bg-white dark:bg-black text-amber-500 focus:ring-amber-500 transition-all ' +
                className
            }
        />
    );
}
