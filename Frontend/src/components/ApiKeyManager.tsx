
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExchangeKey {
  name: string;
  apiKey: string;
  secretKey: string;
}

export const ApiKeyManager = () => {
  const [exchanges, setExchanges] = useState<ExchangeKey[]>([
    { name: "Binance", apiKey: "", secretKey: "" },
    { name: "ByBit", apiKey: "", secretKey: "" },
    { name: "MEXC", apiKey: "", secretKey: "" },
    { name: "KuCoin", apiKey: "", secretKey: "" },
  ]);

  const handleSaveKeys = (index: number) => {
    const exchange = exchanges[index];
    if (!exchange.apiKey || !exchange.secretKey) {
      toast.error("Please fill in both API key and Secret key");
      return;
    }

    // Store in localStorage (temporary solution)
    localStorage.setItem(`${exchange.name.toLowerCase()}_api_key`, exchange.apiKey);
    localStorage.setItem(`${exchange.name.toLowerCase()}_secret_key`, exchange.secretKey);
    toast.success(`${exchange.name} API keys saved successfully`);
  };

  const handleUpdateKey = (index: number, field: 'apiKey' | 'secretKey', value: string) => {
    const newExchanges = [...exchanges];
    newExchanges[index] = { ...newExchanges[index], [field]: value };
    setExchanges(newExchanges);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Exchange API Keys</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {exchanges.map((exchange, index) => (
          <Card key={exchange.name} className="p-4">
            <h3 className="text-lg font-semibold mb-3">{exchange.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">API Key</label>
                <Input
                  type="text"
                  value={exchange.apiKey}
                  onChange={(e) => handleUpdateKey(index, 'apiKey', e.target.value)}
                  placeholder={`${exchange.name} API Key`}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Secret Key</label>
                <Input
                  type="password"
                  value={exchange.secretKey}
                  onChange={(e) => handleUpdateKey(index, 'secretKey', e.target.value)}
                  placeholder={`${exchange.name} Secret Key`}
                />
              </div>
              <Button 
                className="w-full"
                onClick={() => handleSaveKeys(index)}
              >
                Save {exchange.name} Keys
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
