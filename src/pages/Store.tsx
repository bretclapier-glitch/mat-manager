import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search,
  ShoppingBag,
  DollarSign,
  Package,
  Edit,
  Trash2
} from "lucide-react";

const products = [
  { 
    id: 1, 
    name: "Club T-Shirt", 
    price: 25, 
    stock: 45,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"
  },
  { 
    id: 2, 
    name: "Wrestling Singlet", 
    price: 65, 
    stock: 20,
    category: "Gear",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop"
  },
  { 
    id: 3, 
    name: "Club Hoodie", 
    price: 45, 
    stock: 30,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop"
  },
  { 
    id: 4, 
    name: "Wrestling Shoes", 
    price: 95, 
    stock: 12,
    category: "Gear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"
  },
  { 
    id: 5, 
    name: "Headgear", 
    price: 35, 
    stock: 25,
    category: "Gear",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop"
  },
  { 
    id: 6, 
    name: "Club Water Bottle", 
    price: 15, 
    stock: 60,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop"
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Sarah Johnson", items: 2, total: 70, status: "shipped" },
  { id: "ORD-002", customer: "Mike Chen", items: 1, total: 65, status: "processing" },
  { id: "ORD-003", customer: "Lisa Williams", items: 3, total: 85, status: "delivered" },
];

export default function Store() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Apparel", "Gear", "Accessories"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalProducts: products.length,
    totalRevenue: 2840,
    totalOrders: 47,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">MERCH STORE</h1>
            <p className="text-muted-foreground">Manage your club merchandise</p>
          </div>
          <Button variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-wrestling-green/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-wrestling-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                  <p className="text-sm text-muted-foreground">Revenue (This Month)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Orders (This Month)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="shadow-card overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <span className="text-lg font-bold text-gold">${product.price}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className={`${product.stock < 15 ? "text-wrestling-red" : "text-muted-foreground"}`}>
                        {product.stock} in stock
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">RECENT ORDERS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.status === "delivered" ? "bg-wrestling-green/10 text-wrestling-green" :
                      order.status === "shipped" ? "bg-gold/10 text-gold" :
                      "bg-navy/10 text-navy"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{order.customer}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                    <span>{order.items} items</span>
                    <span className="font-bold text-foreground">${order.total}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
