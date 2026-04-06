import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2, Download, AlertCircle } from "lucide-react";

interface SyncStaticDataProps {
  onSyncComplete?: () => void;
}

export default function SyncStaticData({ onSyncComplete }: SyncStaticDataProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const syncAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Get all products from the database
      const response = await fetch("/api/admin/products", {
        headers: {
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const products = await response.json();
      
      // Sync each product with the static file
      let syncCount = 0;
      for (const product of products) {
        try {
          const syncResponse = await fetch("/api/admin/sync-homepage-products", {
            method: "POST",
            headers: {
              "Authorization": "Client-Admin-Secret",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ product })
          });
          
          if (!syncResponse.ok) {
            const errorData = await syncResponse.json();
            console.warn(`Failed to sync product ${product.name}:`, errorData.message);
          } else {
            syncCount++;
          }
        } catch (syncError) {
          console.warn(`Error syncing product ${product.name}:`, syncError);
        }
      }
      
      setSuccess(`Successfully synced ${syncCount} products to static file`);
      
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err) {
      const errorMessage = "Failed to sync products: " + (err as Error).message;
      setError(errorMessage);
      console.error("Error syncing products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border 
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium" style={{ color: colors.text.primary }}>
          Static Data Sync
        </h3>
        <Button
          onClick={syncAllProducts}
          disabled={loading}
          size="sm"
          style={{ 
            backgroundColor: colors.accent, 
            color: colors.background 
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Sync All Products
        </Button>
      </div>
      
      <p className="text-sm mb-3" style={{ color: colors.text.secondary }}>
        Sync all database products with the static homepage-products.ts file
      </p>
      
      {error && (
        <div 
          className="p-3 rounded-md text-sm flex items-start gap-2"
          style={{ 
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            border: "1px solid #ef4444"
          }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div 
          className="p-3 rounded-md text-sm"
          style={{ 
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            color: "#22c55e",
            border: "1px solid #22c55e"
          }}
        >
          {success}
        </div>
      )}
      
      <div className="mt-3 text-xs" style={{ color: colors.text.secondary }}>
        <p className="mb-1">💡 How it works:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Updates the static homepage-products.ts file with current database data</li>
          <li>Preserves existing products and adds new ones</li>
          <li>Useful when making changes through the admin panel that should be reflected in the static file</li>
        </ul>
      </div>
    </div>
  );
}