import { Link, useParams } from "react-router-dom";
import { useBaseballClubData } from "@/components/layout/BaseballClubLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, MapPin, Users, Star, ArrowRight, Calendar, Clock, CheckCircle } from "lucide-react";

export default function BaseballClubHome() {
  const { clubSlug } = useParams();
  const club = useBaseballClubData();
  const basePath = `/baseball/club/${clubSlug}`;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[hsl(150,30%,12%)] py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display text-white mb-4">{club.name.toUpperCase()}</h1>
            <p className="text-xl text-white/70 mb-6">{club.tagline}. Join our youth baseball programs for players of all skill levels.</p>
            <div className="flex items-center gap-4 text-white/70 mb-8">
              <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[hsl(150,45%,45%)]" /><span>Austin, TX</span></div>
              <div className="flex items-center gap-2"><Users className="h-5 w-5 text-[hsl(150,45%,45%)]" /><span>84 Active Players</span></div>
              <div className="flex items-center gap-2"><Star className="h-5 w-5 text-[hsl(150,45%,45%)]" /><span>4.8 Rating</span></div>
            </div>
            <div className="flex gap-4">
              <Link to={`${basePath}/programs`}><Button size="lg" className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">View Programs <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to={`${basePath}/login`}><Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">Parent Login</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs preview */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display text-center mb-12">OUR PROGRAMS</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "8U Rec League", age: "Ages 6-8", price: "$150", spots: "8 spots left" },
              { name: "10U Travel", age: "Ages 9-10", price: "$350", spots: "4 spots left" },
              { name: "14U Travel", age: "Ages 13-14", price: "$400", spots: "6 spots left" },
            ].map((p) => (
              <Card key={p.name} className="shadow-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display mb-1">{p.name.toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{p.age}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[hsl(150,45%,35%)]">{p.price}</span>
                    <Badge variant="outline">{p.spots}</Badge>
                  </div>
                  <Link to={`${basePath}/programs`}><Button className="w-full bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">Learn More</Button></Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[hsl(150,30%,12%)] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display text-center mb-12">WHAT PARENTS SAY</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { quote: "The coaching staff is incredible. My son's skills have improved dramatically in one season.", author: "Mike T.", role: "Parent of 10U Player" },
              { quote: "Best-organized baseball program in Austin. Registration and communication are seamless.", author: "Sarah W.", role: "Parent of 12U Player" },
            ].map((t, i) => (
              <Card key={i} className="bg-white/5 border-[hsl(150,45%,35%)]/20">
                <CardContent className="p-6">
                  <p className="text-lg text-white/90 mb-4">"{t.quote}"</p>
                  <p className="font-semibold text-[hsl(150,45%,45%)]">{t.author}</p>
                  <p className="text-sm text-white/60">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
