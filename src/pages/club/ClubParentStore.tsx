import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Plus, Minus } from "lucide-react";

const products = [
  { id: 1, name: "Club T-Shirt", price: 25, image: "👕", sizes: ["S", "M", "L", "XL"] },
  { id: 2, name: "Wrestling Shorts", price: 35, image: "🩳", sizes: ["S", "M", "L", "XL"] },
  { id: 3, name: "Headgear", price: 45, image: "🤼", sizes: ["Youth", "Adult"] },
  { id: 4, name: "Club Hoodie", price: 50, image: "🧥", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 5, name: "Singlet", price: 60, image: "🎽", sizes: ["YS", "YM", "YL", "S", "M", "L"] },
  { id: 6, name: "Duffle Bag", price: 40, image: "🎒", sizes: ["One Size"] },
];

export default function ClubParentStore() {
  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display">CLUB SHOP</h1>
            <p className="text-muted-foreground">Official gear and equipment.</p>
          </div>
          <Button variant="outline"><ShoppingBag className="h-4 w-4 mr-2" />Cart (0)</Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-6xl text-center mb-4">{p.image}</div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-2xl font-bold text-gold mt-1">${p.price}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.sizes.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs cursor-pointer hover:bg-secondary">{s}</Badge>
                  ))}
                </div>
                <Button variant="hero" className="w-full mt-4">Add to Cart</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
