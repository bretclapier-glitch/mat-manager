import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";

export default function BaseballClubParentLogin() {
  const { clubSlug } = useParams();
  const basePath = `/baseball/club/${clubSlug}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(150,45%,35%)] flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-display">PARENT LOGIN</CardTitle>
          <p className="text-muted-foreground">Access your player dashboard</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="parent@email.com" /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
          <Link to={`${basePath}/parent`}><Button className="w-full bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">Sign In</Button></Link>
          <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link to={`${basePath}/programs`} className="text-[hsl(150,45%,45%)] hover:underline">Register a player</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
