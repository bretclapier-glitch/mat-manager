import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, ExternalLink, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Store() {
  const { profile } = useAuth();
  const [storeUrl, setStoreUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.club_id) loadClub();
  }, [profile]);

  async function loadClub() {
    const { data } = await supabase
      .from('clubs')
      .select('store_url')
      .eq('id', profile!.club_id)
      .single();
    if (data?.store_url) setStoreUrl(data.store_url);
    setLoading(false);
  }

  async function save() {
    if (!profile?.club_id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ store_url: storeUrl })
        .eq('id', profile.club_id);
      if (error) throw error;
      toast.success("Store link saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-display">MERCH STORE</h1>
          <p className="text-muted-foreground">Link your club's merchandise store.</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gold" />
              STORE LINK
            </CardTitle>
            <CardDescription>
              Add a link to your club's merch store (e.g. BSN Sports, CustomInk, Shopify, etc). This will be shown on your public club page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Store URL</Label>
                  <Input
                    type="url"
                    placeholder="https://www.yourstore.com"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                  />
                </div>
                {storeUrl && (
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open store
                  </a>
                )}
                <Button variant="hero" onClick={save} disabled={saving}>
                  {saving
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                    : <><Save className="h-4 w-4 mr-2" />Save Link</>
                  }
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card bg-secondary/30">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Popular options:</strong> BSN Sports, CustomInk, Printful, Shopify, or any other platform you use to sell club merchandise.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
