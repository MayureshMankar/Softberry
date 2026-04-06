import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function NotFound() {
  const { colors } = useTheme();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <Card className="w-full max-w-md mx-4" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8" style={{ color: '#ef4444' }} />
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm" style={{ color: colors.text.secondary }}>
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}