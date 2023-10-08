import { useState } from 'react';
import { Tabs, Transition } from '@mantine/core';

type Props = {
  dataTabs: DataTabsType[];
};

export type DataTabsType = {
  value: string;
  title: string;
  content: JSX.Element;
};

export default function TabTop({ dataTabs }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>(dataTabs[0].value);

  return (
    <Tabs
      defaultValue={dataTabs[0].value}
      color="dark"
      onTabChange={setActiveTab}>
      <Tabs.List grow className="sticky top-0 bg-white z-30">
        {dataTabs.map((tab, index) => (
          <Tabs.Tab
            value={tab.value}
            p="md"
            className={
              activeTab === tab.value ? 'font-semibold' : 'text-gray-400'
            }
            key={index}>
            {tab.title}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {dataTabs.map((tab, index) => (
        <Tabs.Panel value={tab.value} pt="md" key={index}>
          <Transition
            mounted={activeTab === tab.value ? true : false}
            transition="slide-up"
            duration={400}
            timingFunction="ease">
            {(styles) => <div style={styles}>{tab.content}</div>}
          </Transition>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
