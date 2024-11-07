import * as z from 'zod';
import { urlDescription, urlFormSchema, urlSchema } from '../zod/urlSchema';

export type Url = z.infer<typeof urlSchema>;

export type UrlForm = z.infer<typeof urlFormSchema>;

export type UrlDescription = z.infer<typeof urlDescription>;
