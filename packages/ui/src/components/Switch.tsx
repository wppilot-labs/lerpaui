import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../lib/cn';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  // A switch needs an accessible name. If the consumer hasn't paired one via
  // aria-label / aria-labelledby / an external <label htmlFor={id}>, fall back
  // to a generic name so it never ships unlabeled.
  const hasName =
    props['aria-label'] !== undefined ||
    props['aria-labelledby'] !== undefined ||
    props.id !== undefined;
  return (
  <SwitchPrimitives.Root
    aria-label={hasName ? undefined : 'Toggle'}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-150 ease-out hover:data-[state=checked]:bg-primary/90 hover:data-[state=unchecked]:bg-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:data-[state=checked]:bg-primary disabled:hover:data-[state=unchecked]:bg-input data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-150 ease-out motion-reduce:transition-none data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
