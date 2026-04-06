import HeroSection from '@/components/home/HeroSection';
import StorytellingSection from '@/components/home/StorytellingSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProductSection from '@/components/home/FeaturedProductSection';
import ProductGridSection from '@/components/home/ProductGridSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export default function Index() {
  return (
    <>
      <HeroSection />
      <StorytellingSection />
      <CategoriesSection />
      <FeaturedProductSection />
      <ProductGridSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
