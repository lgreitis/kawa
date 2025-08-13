import { useId } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export interface ITab {
  title: string | React.ReactNode;
  value: string;
}

interface ITabsProps {
  tabs: ITab[];
  currentValue: string;
  onChange?: (tab: ITab) => void;
}

export const Tabs: React.FC<ITabsProps> = (props) => {
  const { tabs: propTabs, currentValue, onChange } = props;

  const active = propTabs.find((tab) => tab.value === currentValue);
  const id = useId();

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    onChange?.(newTabs[0]);
  };

  return (
    <div className="no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible">
      {propTabs.map((tab, idx) => (
        <button
          key={tab.value}
          onClick={() => {
            moveSelectedTabToTop(idx);
          }}
          className="relative rounded-full px-4 py-1"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {active?.value === tab.value && (
            <motion.div
              layoutId={`clickedbutton_${id}`}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="absolute inset-0 rounded-sm bg-gray-200"
            />
          )}

          <span
            className={twMerge(
              "duration-600 group relative block text-white transition-colors",
              active?.value === tab.value && "text-black",
            )}
          >
            {tab.title}
          </span>
        </button>
      ))}
    </div>
  );
};
