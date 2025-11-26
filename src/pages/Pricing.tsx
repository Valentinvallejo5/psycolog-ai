import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Pricing = () => {
  const { t } = useLanguage();
  
  const plans = [
    {
      name: t('pricing_free_name'),
      price: "$0",
      period: "",
      description: t('pricing_free_desc'),
      features: [
        t('pricing_free_feature_1'),
        t('pricing_free_feature_2'),
        t('pricing_free_feature_3'),
        t('pricing_free_feature_4'),
        t('pricing_free_feature_5'),
        t('pricing_free_feature_6'),
      ],
      cta: t('pricing_free_cta'),
      highlighted: false,
    },
    {
      name: t('pricing_monthly_name'),
      price: "$5.99",
      period: "/month",
      description: t('pricing_monthly_desc'),
      features: [
        t('pricing_monthly_feature_1'),
        t('pricing_monthly_feature_2'),
        t('pricing_monthly_feature_3'),
        t('pricing_monthly_feature_4'),
        t('pricing_monthly_feature_5'),
      ],
      cta: t('pricing_monthly_cta'),
      highlighted: false,
    },
    {
      name: t('pricing_annual_name'),
      price: "$49.99",
      period: "/year",
      badge: t('pricing_annual_badge'),
      description: t('pricing_annual_desc'),
      features: [
        t('pricing_annual_feature_1'),
        t('pricing_annual_feature_2'),
        t('pricing_annual_feature_3'),
        t('pricing_annual_feature_4'),
        t('pricing_annual_feature_5'),
      ],
      cta: t('pricing_annual_cta'),
      highlighted: true,
    },
  ];
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-20 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('pricing_title')}
            </h1>
            <p className="text-lg md:text-xl text-primary max-w-3xl mx-auto">
              {t('pricing_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative ${
                  plan.highlighted 
                    ? 'border-2 border-primary shadow-[var(--shadow-glow)]' 
                    : 'border-border'
                } bg-card hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {plan.badge}
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button 
                    variant={plan.highlighted ? "hero" : "default"} 
                    className="w-full"
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
