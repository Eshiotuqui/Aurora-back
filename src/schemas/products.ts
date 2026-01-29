import { z } from 'zod';


export const baseProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  category: z.enum(['bijuteria', 'croche']),
  subtype: z.string(),
  imgUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional().default(true),
});


export const productSchema = baseProductSchema.refine((data) => {
  const validSubtypes: Record<'bijuteria' | 'croche', string[]> = {
    bijuteria: ['brinco', 'colar', 'pulseira', 'chaveiro'],
    croche: ['touca', 'bolsa', 'porta copo', 'cachecol']
  };
  return validSubtypes[data.category].includes(data.subtype);
}, {
  message: "Subtipo inválido para a categoria selecionada",
  path: ["subtype"]
});

export type ProductInput = z.infer<typeof productSchema>;