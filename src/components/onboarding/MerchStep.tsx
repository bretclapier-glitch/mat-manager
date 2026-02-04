import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Link, Store, ExternalLink, CheckCircle } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface MerchStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function MerchStep({ data, onChange }: MerchStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Merch Store</h2>
        <p className="text-muted-foreground">Set up your club merchandise store</p>
      </div>

      <RadioGroup
        value={data.merchSetupType}
        onValueChange={(value: 'existing' | 'shopify' | 'none') => 
          onChange({ merchSetupType: value })
        }
        className="space-y-4"
      >
        {/* Link Existing Store */}
        <div 
          className={`
            relative p-6 rounded-xl border-2 cursor-pointer transition-all
            ${data.merchSetupType === 'existing' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
            }
          `}
          onClick={() => onChange({ merchSetupType: 'existing' })}
        >
          <div className="flex items-start gap-4">
            <RadioGroupItem value="existing" id="existing" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Link className="h-5 w-5 text-blue-500" />
                </div>
                <Label htmlFor="existing" className="text-lg font-semibold cursor-pointer">
                  I have an existing store
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Link to your current online store (Squad Locker, OrderMyGear, etc.)
              </p>
              
              {data.merchSetupType === 'existing' && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Store Name</Label>
                    <Input
                      placeholder="e.g., Squad Locker, OrderMyGear"
                      value={data.existingMerchStoreName}
                      onChange={(e) => onChange({ existingMerchStoreName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Store URL</Label>
                    <Input
                      type="url"
                      placeholder="https://your-store-url.com"
                      value={data.existingMerchStoreUrl}
                      onChange={(e) => onChange({ existingMerchStoreUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Build with Shopify */}
        <div 
          className={`
            relative p-6 rounded-xl border-2 cursor-pointer transition-all
            ${data.merchSetupType === 'shopify' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
            }
          `}
          onClick={() => onChange({ merchSetupType: 'shopify' })}
        >
          <div className="flex items-start gap-4">
            <RadioGroupItem value="shopify" id="shopify" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Store className="h-5 w-5 text-green-500" />
                </div>
                <Label htmlFor="shopify" className="text-lg font-semibold cursor-pointer">
                  Build a new store with Shopify
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create a fully integrated merch store powered by Shopify
              </p>
              
              {data.merchSetupType === 'shopify' && (
                <div className="space-y-4 pt-2 animate-fade-in">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Product catalog management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Inventory tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Order fulfillment</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You'll be guided through Shopify setup after completing onboarding.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skip for Now */}
        <div 
          className={`
            relative p-6 rounded-xl border-2 cursor-pointer transition-all
            ${data.merchSetupType === 'none' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
            }
          `}
          onClick={() => onChange({ merchSetupType: 'none' })}
        >
          <div className="flex items-start gap-4">
            <RadioGroupItem value="none" id="none" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-muted">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <Label htmlFor="none" className="text-lg font-semibold cursor-pointer">
                  Skip for now
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                You can set up your merch store later from the dashboard
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>

      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          Selling club merchandise helps build team spirit and can offset club expenses.
        </p>
      </div>
    </div>
  );
}
