"use client";

import CategoryPieChart from "@/components/Dashboard/CategoryPieChart";

type Props = {
  categories: {
    name: string;
    value: number;
  }[];
};

export default function CategoryReport({ categories }: Props) {
  return (
    <CategoryPieChart
      data={categories}
      title="Category Distribution"
      subtitle="Events grouped by category type"
    />
  );
}