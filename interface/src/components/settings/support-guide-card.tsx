import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "../ui/button";
import Link from "next/link";

export function SupportGuideCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guia de Uso e Suporte</CardTitle>
        <CardDescription>Aprenda a usar a Aura e encontre ajuda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Como a Aura calcula a fadiga?</AccordionTrigger>
            <AccordionContent>
              A Aura utiliza uma combinação de dados biométricos (como variabilidade da frequência cardíaca e duração do sono) e informações que você fornece (como níveis de estresse e atividade) para calcular uma pontuação de fadiga. O modelo de IA analisa esses pontos de dados para identificar padrões e fornecer uma pontuação precisa.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Como posso redefinir minha conversa?</AccordionTrigger>
            <AccordionContent>
              Você pode limpar todo o seu histórico de conversas com a Aura clicando no botão "Limpar Histórico" na seção "Histórico de Conversas" acima. Isso redefinirá a conversa para o estado inicial.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Como funcionam os alertas do WhatsApp?</AccordionTrigger>
            <AccordionContent>
                Ao integrar com o WhatsApp, você pode receber alertas proativos de fadiga e sugestões de bem-estar diretamente no seu celular. Isso ajuda você a se manter ciente do seu estado e a tomar medidas preventivas, mesmo quando não está usando o aplicativo ativamente. Você pode gerenciar essa integração no seu painel.
            </AccordionContent>
          </AccordionItem>
           <AccordionItem value="item-4">
            <AccordionTrigger>Precisa de mais ajuda?</AccordionTrigger>
            <AccordionContent>
                <p className="mb-4">Se você não encontrou a resposta que procurava, nossa equipe de suporte está pronta para ajudar.</p>
                <Button asChild>
                    <Link href="mailto:suporte@harmonyia.com" target="_blank">Contatar Suporte</Link>
                </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
