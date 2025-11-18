import { PlaceHolderImages } from './placeholder-images';

const libraryContent = [
    {
        id: "breathing-exercise",
        title: "Respiração Consciente",
        category: "Exercício de Respiração",
        duration: "8 min",
        youtubeUrl: "https://youtu.be/DUsx3EzIm2Q?si=_Gu7-lgyTRHcmJlz"
    },
    {
        id: "stretching-video",
        title: "Alongamento de Corpo Inteiro",
        category: "Vídeo de Alongamento",
        duration: "10 min",
        youtubeUrl: "https://youtu.be/F1iejoRbRts?si=v8urulLeS7YRZgpa"
    },
    {
        id: "relaxing-music",
        title: "Ondas Calmas",
        category: "Música Relaxante",
        duration: "36 min",
        youtubeUrl: "https://youtu.be/qAUdQpIpvUY?si=FGCFzgMsYOJ4SjiZ"
    },
    {
        id: "guided-meditation",
        title: "Paz da Montanha",
        category: "Meditação Guiada",
        duration: "15 min",
        youtubeUrl: "https://youtu.be/GcjmiKuG8g0?si=p1hUY-j96NHfEJa_"
    },
    {
        id: "morning-yoga",
        title: "Fluxo do Amanhecer",
        category: "Vídeo de Yoga",
        duration: "10 min",
        youtubeUrl: "https://youtu.be/C2goOWyQ4pg?si=8cbjUPrV0N0-WZ11"
    },
    {
        id: "ambient-sounds",
        title: "Ambiente da Floresta",
        category: "Sons Ambiente",
        duration: "1 hr",
        youtubeUrl: "https://youtu.be/DNwvIQEXHP4?si=Joefc4ItFn9sFr_v"
    }
];

export const libraryItems = libraryContent.map(item => {
    const placeholder = PlaceHolderImages.find(p => p.id === item.id);
    return {
        ...item,
        imageUrl: placeholder?.imageUrl || 'https://picsum.photos/seed/fallback/600/400',
        imageHint: placeholder?.imageHint || 'abstract',
    }
});
