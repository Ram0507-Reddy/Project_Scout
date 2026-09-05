import heroDevImg from '../assets/hero_image.png';
import docPaperImg from '../assets/illustrations/doc_paper.png';
import mentorChatImg from '../assets/illustrations/mentor_chat.png';
import cardTechImg from '../assets/illustrations/card_tech.png';
import cardStarsImg from '../assets/illustrations/card_stars.png';
import cardSetupImg from '../assets/illustrations/card_setup.png';

export const HeroDeveloperIllustration = ({ className = "w-full max-w-xl h-auto" }) => (
  <img 
    src={heroDevImg} 
    alt="Developer building solutions" 
    className={className} 
    loading="eager"
  />
);

export const CardTechIllustration = ({ className = "w-44 h-auto object-contain" }) => (
  <img 
    src={cardTechImg} 
    alt="A variety of technologies" 
    className={className} 
    loading="lazy"
  />
);

export const CardStarsIllustration = ({ className = "w-44 h-auto object-contain" }) => (
  <img 
    src={cardStarsImg} 
    alt="Code help from experts" 
    className={className} 
    loading="lazy"
  />
);

export const CardSetupIllustration = ({ className = "w-44 h-auto object-contain" }) => (
  <img 
    src={cardSetupImg} 
    alt="Effortless setup" 
    className={className} 
    loading="lazy"
  />
);

export const MentorChatIllustration = ({ className = "w-40 h-auto object-contain" }) => (
  <img 
    src={mentorChatImg} 
    alt="Mentor discussing architecture" 
    className={className} 
    loading="lazy"
  />
);

export const DocumentationIllustration = ({ className = "w-40 h-auto object-contain" }) => (
  <img 
    src={docPaperImg} 
    alt="Documentation and research papers" 
    className={className} 
    loading="lazy"
  />
);
