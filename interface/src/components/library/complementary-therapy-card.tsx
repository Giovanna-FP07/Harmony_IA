import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Paintbrush, Music, Heart, Brain } from "lucide-react";

const therapies = [
    {
        value: "item-1",
        trigger: "Equoterapia",
        icon: <Heart className="mr-2 h-6 w-6 text-primary" />,
        content: "A equoterapia utiliza o cavalo como instrumento terapêutico para promover o desenvolvimento biopsicossocial de pessoas com deficiência e/ou necessidades especiais. O contato com o animal e a natureza proporciona relaxamento, melhora o equilíbrio e a coordenação motora."
    },
    {
        value: "item-2",
        trigger: "Arterapia",
        icon: <Paintbrush className="mr-2 h-6 w-6 text-primary" />,
        content: "A arteterapia é uma forma de terapia que utiliza a expressão artística como meio de comunicação. Pintura, desenho, escultura e outras formas de arte ajudam a expressar sentimentos, reduzir o estresse e aumentar o autoconhecimento."
    },
    {
        value: "item-3",
        trigger: "Musicoterapia",
        icon: <Music className="mr-2 h-6 w-6 text-primary" />,
        content: "A musicoterapia utiliza a música e seus elementos (som, ritmo, melodia e harmonia) para facilitar e promover a comunicação, o aprendizado, a mobilização, a expressão e a organização para fins terapêuticos. Pode ajudar a aliviar a dor, reduzir a ansiedade e melhorar o humor."
    },
    {
        value: "item-4",
        trigger: "Meditação",
        icon: <Brain className="mr-2 h-6 w-6 text-primary" />,
        content: "A meditação é uma prática que envolve focar a mente em um objeto, pensamento ou atividade em particular para treinar a atenção e a consciência, e alcançar um estado de clareza mental e estabilidade emocional. É eficaz na redução do estresse, ansiedade e na promoção da calma interior."
    }
];

export function ComplementaryTherapyCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tipos de Terapia Complementar</CardTitle>
                <CardDescription>Explore abordagens que podem auxiliar no seu bem-estar.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {therapies.map((therapy) => (
                        <AccordionItem value={therapy.value} key={therapy.value}>
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    {therapy.icon}
                                    {therapy.trigger}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {therapy.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
