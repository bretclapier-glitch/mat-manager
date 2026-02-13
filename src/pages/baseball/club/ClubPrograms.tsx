import { Link, useParams } from "react-router-dom";
import { useBaseballClubData } from "@/components/layout/BaseballClubLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, ArrowRight, CheckCircle } from "lucide-react";

const programs = [
  { id: 1, name: "8U Rec League", ageRange: "Ages 6-8", price: 150, duration: "12 weeks", schedule: "Sat 9:00 AM - 11:00 AM", spots: 20, filled: 12, description: "Introduction to baseball fundamentals in a fun environment.", features: ["T-ball & coach pitch", "Basic fielding", "Team building", "End-of-season tournament"], startDate: "March 1, 2024" },
  { id: 2, name: "10U Travel", ageRange: "Ages 9-10", price: 350, duration: "Season (Mar-Jul)", schedule: "Tue/Thu 5:30 PM + Sat games", spots: 15, filled: 11, description: "Competitive travel team for experienced players.", features: ["Tournament play", "Advanced hitting", "Pitching mechanics", "Game strategy"], startDate: "March 1, 2024" },
  { id: 3, name: "12U Rec League", ageRange: "Ages 11-12", price: 200, duration: "12 weeks", schedule: "Mon/Wed 5:00 PM", spots: 18, filled: 14, description: "Recreational league for skill development and fun.", features: ["Live pitching", "Position training", "Base running", "Sportsmanship"], startDate: "March 1, 2024" },
  { id: 4, name: "14U Travel", ageRange: "Ages 13-14", price: 400, duration: "Season (Mar-Jul)", schedule: "Mon/Wed/Fri 4:00 PM + weekend games", spots: 15, filled: 9, description: "Elite travel program preparing players for high school baseball.", features: ["Advanced coaching", "Showcase events", "Video analysis", "College prep"], startDate: "March 1, 2024" },
];

export default function BaseballClubPrograms() {
  const { clubSlug } = useParams();
  const basePath = `/baseball/club/${clubSlug}`;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display mb-4">OUR PROGRAMS</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Choose the right program for your player. All programs include professional coaching and equipment.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((p) => {
            const spotsLeft = p.spots - p.filled;
            const fill = (p.filled / p.spots) * 100;
            return (
              <Card key={p.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div><CardTitle className="text-2xl font-display">{p.name.toUpperCase()}</CardTitle><p className="text-muted-foreground">{p.ageRange}</p></div>
                    <Badge variant="outline" className="text-[hsl(150,45%,35%)] border-[hsl(150,45%,35%)]">${p.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{p.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>Starts {p.startDate}</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>{p.duration}</span></div>
                    <div className="flex items-center gap-2 col-span-2"><Users className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>{p.schedule}</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{spotsLeft} spots remaining</span><span className="font-medium">{Math.round(fill)}% full</span></div>
                    <Progress value={fill} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.features.map(f => <div key={f} className="flex items-center gap-1 text-sm bg-secondary/50 px-2 py-1 rounded"><CheckCircle className="h-3 w-3 text-[hsl(150,45%,35%)]" /><span>{f}</span></div>)}
                  </div>
                  <Link to={`${basePath}/register/${p.id}`}>
                    <Button className="w-full mt-4 bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">Register Now <ArrowRight className="h-4 w-4 ml-2" /></Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
