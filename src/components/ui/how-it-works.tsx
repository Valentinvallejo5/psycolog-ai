"use client";

import { cn } from "@/lib/utils";
import { UserPlus, Sliders, Sparkles } from "lucide-react";
import type React from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
}) => (
  <div
    className={cn(
      "relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-zinc-800 dark:to-zinc-900 p-6 text-card-foreground transition-all duration-300 ease-in-out",
      "hover:scale-105 hover:shadow-xl hover:border-primary/50 hover:shadow-primary/10"
    )}
  >
    {/* Icon */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
      {icon}
    </div>
    {/* Title and Description */}
    <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
    <p className="mb-6 text-muted-foreground">{description}</p>
    {/* Benefits List */}
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          </div>
          <span className="text-sm text-muted-foreground">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  ...props
}) => {
  const { t } = useLanguage();
  
  const stepsData = [
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: t('how_step_1_title'),
      description: t('how_step_1_desc'),
      benefits: [
        t('how_step_1_benefit_1'),
        t('how_step_1_benefit_2'),
        t('how_step_1_benefit_3'),
      ],
    },
    {
      icon: <Sliders className="h-6 w-6" />,
      title: t('how_step_2_title'),
      description: t('how_step_2_desc'),
      benefits: [
        t('how_step_2_benefit_1'),
        t('how_step_2_benefit_2'),
        t('how_step_2_benefit_3'),
      ],
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t('how_step_3_title'),
      description: t('how_step_3_desc'),
      benefits: [
        t('how_step_3_benefit_1'),
        t('how_step_3_benefit_2'),
        t('how_step_3_benefit_3'),
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full bg-background dark:bg-zinc-950 py-16 sm:py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('how_it_works_title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('how_it_works_subtitle')}
          </p>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-8 w-full max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute left-[16.6667%] top-1/2 h-0.5 w-[66.6667%] -translate-y-1/2 bg-primary/30"
          ></div>
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-primary text-primary-foreground font-semibold ring-4 ring-background dark:ring-zinc-950"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
