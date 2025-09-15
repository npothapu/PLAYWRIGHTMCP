// Auto-generated carousel copy data from Blue Paradox website
// Generated at: 2025-09-13T02:57:51.489Z

export interface CarouselItem {
  headline?: string;
  subheadline?: string;
  description?: string;
  buttonText?: string;
  linkUrl?: string;
  imageAlt?: string;
  tags?: string[];
  fullText?: string;
}

export interface CarouselCopyData {
  type: string;
  selector: string;
  title?: string;
  description?: string;
  items: CarouselItem[];
  navigation?: {
    nextButtonText?: string;
    prevButtonText?: string;
    paginationLabels?: string[];
  };
}

export interface CarouselCopyExtraction {
  extractedAt: string;
  pageUrl: string;
  pageTitle: string;
  carousels: CarouselCopyData[];
}

export const carouselCopy: CarouselCopyExtraction = {
  "extractedAt": "2025-09-13T02:57:51.489Z",
  "pageUrl": "https://www.blueparadox.com/",
  "pageTitle": "The Blue Paradox: Finding Solutions to Plastic Pollution",
  "carousels": [
    {
      "type": "Stories Carousel",
      "selector": ".swiper.scj-stories-carousel",
      "title": "Microplastics in the Brain: A Growing Concern",
      "description": "",
      "items": [
        {
          "headline": "Microplastics in the Brain: A Growing Concern",
          "buttonText": "Watch Film",
          "imageAlt": "A Spoon's Worth of Plastic in the Brain",
          "fullText": "Microplastics in the Brain: A Growing ConcernFollow researchers as they uncover microplastics in the human brain, sparking vital conversations about our health and the plastic waste crisis.Watch FilmLearn More"
        },
        {
          "headline": "The Human Side of Plastic: Babacar's Story",
          "buttonText": "Watch Film",
          "imageAlt": "Babacar&apos;s Story: The Human Side of Plastic",
          "fullText": "The Human Side of Plastic: Babacar's StoryJoin Babacar Thiaw, a Senegalese surfer and restaurateur, as he tackles plastic pollution in his hometown of Dakar, sharing the extraordinary yet simple changes he implemented to reduce waste in his community.Watch FilmLearn More"
        },
        {
          "headline": "Saving Maine's Lobster Coast: A Community's Stand Against Plastic Waste",
          "buttonText": "Watch Film",
          "imageAlt": "Lorem ipsum dolor",
          "fullText": "Saving Maine's Lobster Coast: A Community's Stand Against Plastic WasteAlong Maine’s lobster coast, fishermen and scientists are taking steps to fight plastic pollution and protect their ocean, industry, and way of life. Full film coming soon.Watch FilmLearn More"
        }
      ],
      "navigation": {}
    },
    {
      "type": "News Carousel",
      "selector": ".scj-infinite-news-carousel",
      "title": "News Carousel 1",
      "items": []
    },
    {
      "type": "News Carousel",
      "selector": ".scj-infinite-news-carousel",
      "title": "News Carousel 2",
      "items": []
    }
  ]
};

// Helper functions

export function getStoriesCarouselCopy(): CarouselCopyData | undefined {
  return carouselCopy.carousels.find(c => c.type === 'Stories Carousel');
}

export function getNewsCarouselsCopy(): CarouselCopyData[] {
  return carouselCopy.carousels.filter(c => c.type === 'News Carousel');
}

export function getBannerCarouselCopy(): CarouselCopyData | undefined {
  return carouselCopy.carousels.find(c => c.type === '360 Banner Carousel');
}

export function getAllCarouselHeadlines(): string[] {
  return carouselCopy.carousels.flatMap(carousel => 
    carousel.items
      .map(item => item.headline)
      .filter(headline => headline && headline.length > 0)
  ) as string[];
}

export function getAllCarouselButtons(): Array<{ text: string; url?: string; carouselType: string }> {
  return carouselCopy.carousels.flatMap(carousel => 
    carousel.items
      .filter(item => item.buttonText)
      .map(item => ({
        text: item.buttonText!,
        url: item.linkUrl,
        carouselType: carousel.type
      }))
  );
}

export function getCarouselCopyForTesting(carouselType: string): CarouselItem[] {
  const carousel = carouselCopy.carousels.find(c => c.type === carouselType);
  return carousel ? carousel.items : [];
}
