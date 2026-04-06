import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { HomepageProduct } from "@/data/homepage-products";

interface ProductSaverProps {
  products: HomepageProduct[];
}

export default function ProductSaver({ products }: ProductSaverProps) {
  const { colors } = useTheme();
  const [showCode, setShowCode] = useState(false);
  
  // Generate the TypeScript code for the products array
  const generateProductsCode = () => {
    return `export const homepageProducts: HomepageProduct[] = ${JSON.stringify(products, null, 2)};`;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateProductsCode());
  };
  
  const downloadCode = () => {
    const blob = new Blob([generateProductsCode()], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "homepage-products-update.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
      <CardHeader>
        <CardTitle style={{ color: colors.text.primary }}>Save Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p style={{ color: colors.text.secondary }}>
          To save your changes, you need to manually update the homepage-products.ts file:
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowCode(!showCode)}
            style={{ 
              backgroundColor: colors.accent, 
              color: colors.background 
            }}
          >
            {showCode ? "Hide Code" : "Show Code"}
          </Button>
          
          {showCode && (
            <>
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                style={{ 
                  borderColor: `${colors.text.secondary}33`, 
                  color: colors.text.secondary,
                  backgroundColor: 'transparent'
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              
              <Button 
                onClick={downloadCode}
                variant="outline"
                style={{ 
                  borderColor: `${colors.text.secondary}33`, 
                  color: colors.text.secondary,
                  backgroundColor: 'transparent'
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
        
        {showCode && (
          <Textarea
            value={generateProductsCode()}
            rows={20}
            readOnly
            style={{ 
              backgroundColor: colors.background,
              color: colors.text.primary,
              borderColor: colors.border,
              fontFamily: "monospace",
              fontSize: "12px"
            }}
          />
        )}
        
        <div className="text-sm" style={{ color: colors.text.secondary }}>
          <p className="font-medium mb-2">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Show Code" to view the updated products array</li>
            <li>Copy the code or download it as a file</li>
            <li>Open the file <code style={{ backgroundColor: colors.background, padding: "2px 4px", borderRadius: "4px" }}>client/src/data/homepage-products.ts</code></li>
            <li>Replace the existing <code style={{ backgroundColor: colors.background, padding: "2px 4px", borderRadius: "4px" }}>homepageProducts</code> array with the new code</li>
            <li>Save the file and refresh the application</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}