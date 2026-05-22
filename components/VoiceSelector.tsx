"use client";
import { voiceOptions } from '@/lib/constant';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Field, FieldContent, FieldDescription, FieldLabel } from './ui/field';

function VoiceSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Object.values(voiceOptions).map((voice) => (
        <Field key={voice.name} orientation="horizontal" className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <RadioGroupItem value={voice.name} id={`voice-${voice.name}`} className="mt-0.5" />
          <FieldContent>
            <FieldLabel htmlFor={`voice-${voice.name}`} className="font-medium cursor-pointer">
              {voice.name}
            </FieldLabel>
            <FieldDescription className="text-sm text-muted-foreground">
              {voice.description}
            </FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  );
}

export default VoiceSelector;
