"use client";

import { useEffect, useState } from "react";
import axios from "axios";
//@ts-ignore
import Cookies from "js-cookie";

import { Check, X, Star, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL;

const durations = ["monthly", "quarterly", "yearly"];

export default function PackagePlansPage() {
  const [selectedDuration, setSelectedDuration] = useState("monthly");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${baseUrl}/user/get-packages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPackages(res.data.packages); // Adjust based on actual response shape
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Get unique feature names across all packages
  const featureNames = Array.from(
    new Set(
      packages.flatMap((pkg) => pkg.features.map((f: any) => f.name))
    )
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground text-lg">
        Loading packages...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Package className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Subscription Plans
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your trading strategy needs. All plans include access to our advanced backtesting and strategy management tools.
        </p>
      </div>

      {/* Duration Selector */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-background p-1">
          {durations.map((d) => (
            <Button
              key={d}
              variant={selectedDuration === d ? "default" : "ghost"}
              onClick={() => setSelectedDuration(d)}
              className="rounded-md"
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {packages.map((pkg: any) => (
          <Card
            key={pkg.name}
            className={`relative transition-all duration-200 hover:shadow-lg ${
              pkg.mostPopular
                ? "border-primary shadow-lg scale-105"
                : "border-border hover:border-primary/50"
            }`}
          >
            {pkg.mostPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold">{pkg.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">
                  ₹{pkg.pricingPerDay[selectedDuration]}
                </div>
                <div className="text-sm text-muted-foreground">Per Day</div>
                {pkg.pricingPerDay[selectedDuration] === 0 && (
                  <div className="text-sm text-green-600 font-medium">Free Forever</div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {featureNames.map((featureName: string) => {
                  const feature = pkg.features.find((f: any) => f.name === featureName);
                  return (
                    <li key={featureName} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-full p-0.5 ${
                          feature?.enabled
                            ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                            : "text-red-600 bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {feature?.enabled ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          feature?.enabled
                            ? "text-foreground"
                            : "text-muted-foreground line-through"
                        }`}
                      >
                        {feature?.value || featureName}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Button
                className={`w-full ${
                  pkg.mostPopular
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
                variant={pkg.mostPopular ? "default" : "secondary"}
              >
                {pkg.pricingPerDay[selectedDuration] === 0 ? "Get Started" : "Subscribe Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-4 pt-8 border-t border-border">
        <h3 className="text-lg font-semibold">All Plans Include</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>API Access</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Data Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
