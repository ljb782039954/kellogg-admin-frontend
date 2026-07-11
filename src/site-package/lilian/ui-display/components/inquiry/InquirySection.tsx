// import { Mail } from "lucide-react";
// import RichText from "@/runtime/components/RichText";
// import type { Language } from '@/cms/types';
// import InquiryFormContainer from './InquiryFormContainer';
// import { lilianInquiryContent } from './inquiryContent';

// export interface InquirySectionProps {
//   lang: Language;
// }

// export default function Inquiry({
//   lang,
// }: InquirySectionProps) {
//   const language = lang === 'zh' || lang === 'en' ? lang : 'en';
//   const resolvedTitle = lilianInquiryContent.title[language] || lilianInquiryContent.title.en;
//   const resolvedSubtitle =  lilianInquiryContent.description[language] || lilianInquiryContent.description.en;
//   const resolvedPageContent = lilianInquiryContent;

//   return (
//     <section className="px-6 py-12 bg-ink-strong text-on-dark">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
//         <div>
//           <div className="w-12 h-12 border border-on-dark-border flex items-center justify-center mb-6">
//             <Mail className="w-5 h-5" />
//           </div>
//           {resolvedTitle && <h2 className="font-luxury-heading text-3xl md:text-5xl font-light leading-tight">{resolvedTitle}</h2>}
//           {resolvedSubtitle && <RichText value={resolvedSubtitle} className="mt-5 text-sm md:text-base leading-7 text-on-dark-soft" />}
//         </div>

//         <InquiryFormContainer lang={lang} pageContent={resolvedPageContent} />
//       </div>
//     </section>
//   );
// }
