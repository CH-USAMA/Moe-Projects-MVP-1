import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-all ' +
                className
            }
            ref={localRef}
        />
    );
});
