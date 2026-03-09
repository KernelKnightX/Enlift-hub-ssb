import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useTestConfig } from '@/hooks/useTestData';
import { ArrowLeft, Clock, Target, Eye, PenTool } from 'lucide-react';

const ppdtSetOptions = [
  { value: 5, label: '5 Pictures', duration: 22.5, description: 'Quick assessment set', perItemTime: 30 },
  { value: 10, label: '10 Pictures', duration: 45, description: 'Standard practice set', perItemTime: 30 },
  { value: 15, label: '15 Pictures', duration: 67.5, description: 'Comprehensive test set', perItemTime: 30 }
];

export default function PPDTSetSelectionPage() {
  const navigate = useNavigate();
  const config = useTestConfig('ppdt');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedSet, setSelectedSet] = useState<number>(1);

  if (!config) {
    return <div>Test not found</div>;
  }

  const selectedConfig = ppdtSetOptions.find(opt => opt.value === selectedOption);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/ppdt/instructions')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Instructions
        </Button>

        <Card className="border-2">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <Badge className="mb-2">PPDT</Badge>
                <CardTitle className="heading-md">Select Test Configuration</CardTitle>
              </div>
            </div>
            <p className="text-muted-foreground">
              Choose a set and number of pictures for your PPDT practice session
            </p>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Set Selection */}
            <div className="space-y-2">
              <Label htmlFor="set-select" className="text-sm font-semibold">
                Select Set
              </Label>
              <select
                id="set-select"
                value={selectedSet}
                onChange={(e) => setSelectedSet(Number(e.target.value))}
                className="w-full p-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((set) => (
                  <option key={set} value={set}>
                    Set {set}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Choose from 10 different sets of practice pictures
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {ppdtSetOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedOption(option.value)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedOption === option.value
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={selectedOption === option.value ? 'default' : 'outline'}>
                      {option.value}
                    </Badge>
                    {selectedOption === option.value && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold mb-2">{option.label}</p>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{option.duration} min total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{option.perItemTime}s viewing per picture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4" />
                      <span>4 min writing per picture</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Configuration Details */}
            {selectedConfig && (
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Test Configuration</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pictures</p>
                      <p className="font-semibold">{selectedConfig.value} pictures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Duration</p>
                      <p className="font-semibold">{selectedConfig.duration} minutes</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• {selectedConfig.perItemTime} seconds to view each picture</p>
                  <p>• 4 minutes to write story for each picture</p>
                </div>
              </div>
            )}

            {/* Start Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                disabled={!selectedOption}
                onClick={() => navigate(`/ppdt/test?set=set${selectedSet}&count=${selectedOption}`)}
                className="px-12"
              >
                Start PPDT Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}