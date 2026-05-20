import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const pageKeyByPath: Record<string, string> = {
  '/contact': 'contact',
  '/shipping': 'shipping',
  '/faq': 'faq',
  '/size-guide': 'sizeGuide',
  '/careers': 'careers',
  '/press': 'press',
  '/sustainability': 'sustainability',
  '/privacy': 'privacy',
  '/terms': 'terms',
};

const pageContent: Record<string, { blocks: { title: string; text: string }[]; notes: string[] }> = {
  contact: {
    blocks: [
      { title: 'Atendimento ao cliente', text: 'Nosso time fictício responde dúvidas sobre pedidos, produtos, trocas e experiência de compra em até 1 dia útil.' },
      { title: 'Canais disponíveis', text: 'E-mail: atendimento@helomodas.demo | WhatsApp: (11) 4002-2026 | Horário: segunda a sábado, das 10h às 20h.' },
      { title: 'Antes de falar conosco', text: 'Tenha em mãos o número do pedido, o e-mail usado na compra e uma breve descrição do que aconteceu.' },
    ],
    notes: ['Suporte para pedidos', 'Dúvidas sobre produtos', 'Atendimento para parcerias'],
  },
  shipping: {
    blocks: [
      { title: 'Prazos de entrega', text: 'Capitais recebem em 3 a 7 dias úteis. Demais regiões recebem em 5 a 12 dias úteis, conforme disponibilidade logística.' },
      { title: 'Trocas e devoluções', text: 'Você pode solicitar devolução em até 30 dias corridos após o recebimento, desde que o item esteja sem sinais de uso.' },
      { title: 'Rastreamento', text: 'Assim que o pedido for enviado, o cliente recebe um código de rastreio fictício por e-mail e no painel da conta.' },
    ],
    notes: ['Frete grátis acima de US$ 150', 'Embalagem premium', 'Devolução assistida'],
  },
  faq: {
    blocks: [
      { title: 'Como acompanho meu pedido?', text: 'Entre em sua conta e acesse a área de pedidos. Em modo demo, os pedidos exibem status simulados para validar o fluxo.' },
      { title: 'Posso alterar o endereço?', text: 'Alterações são possíveis antes da etapa de envio. Depois disso, o atendimento precisa revisar manualmente a solicitação.' },
      { title: 'Os produtos são reais?', text: 'Este projeto usa catálogo e dados fictícios para simular uma loja completa, incluindo carrinho, favoritos e checkout.' },
    ],
    notes: ['Pagamento', 'Entrega', 'Conta e favoritos'],
  },
  sizeGuide: {
    blocks: [
      { title: 'Como comparar medidas', text: 'Meça um item que você já usa e compare comprimento, largura e altura com as informações da página do produto.' },
      { title: 'Acessórios e bolsas', text: 'Considere espaço interno, alças e proporção no corpo. Fotos em contexto ajudam a entender o volume visual.' },
      { title: 'Produtos de beleza', text: 'Veja peso, volume e tipo de embalagem para escolher o tamanho ideal para uso diário ou viagem.' },
    ],
    notes: ['Compare antes da compra', 'Priorize proporção', 'Consulte detalhes do produto'],
  },
  careers: {
    blocks: [
      { title: 'Cultura', text: 'A Helô Modas fictícia valoriza bom gosto, atenção ao detalhe e pessoas que pensam produto com clareza.' },
      { title: 'Áreas futuras', text: 'Produto digital, conteúdo editorial, atendimento premium, logística, dados e curadoria de catálogo.' },
      { title: 'Banco de talentos', text: 'Em uma versão real, candidatos poderiam enviar portfólio e currículo para talentos@helomodas.demo.' },
    ],
    notes: ['Produto', 'Design', 'Atendimento premium'],
  },
  press: {
    blocks: [
      { title: 'Kit de imprensa', text: 'Materiais fictícios incluem logotipo, manifesto da marca, imagens de loja, fotos de campanha e dados institucionais.' },
      { title: 'Solicitações', text: 'Pedidos de entrevista, parcerias editoriais e pautas podem ser enviados para imprensa@helomodas.demo.' },
      { title: 'Posicionamento', text: 'A marca simula uma curadoria premium com foco em experiência digital, lifestyle e compra assistida.' },
    ],
    notes: ['Brand kit', 'Campanhas', 'Parcerias editoriais'],
  },
  sustainability: {
    blocks: [
      { title: 'Curadoria consciente', text: 'A proposta fictícia prioriza produtos com apelo durável, reduzindo excesso visual e compras por impulso.' },
      { title: 'Embalagens', text: 'A loja simula embalagens recicláveis, etiquetas reduzidas e reaproveitamento de materiais de proteção.' },
      { title: 'Operação', text: 'Os processos são pensados para reduzir retrabalho, concentrar envios e incentivar devoluções responsáveis.' },
    ],
    notes: ['Menos excesso', 'Mais durabilidade', 'Operação responsável'],
  },
  privacy: {
    blocks: [
      { title: 'Dados da conta', text: 'Em produção, seriam usados nome, e-mail, endereço e histórico de pedidos apenas para viabilizar a compra.' },
      { title: 'Segurança', text: 'Tokens e credenciais nunca devem aparecer no frontend. Informações sensíveis ficam protegidas em variáveis de ambiente.' },
      { title: 'Controle do cliente', text: 'O cliente poderia solicitar atualização, exportação ou remoção de dados cadastrais pelo atendimento.' },
    ],
    notes: ['Dados mínimos', 'Sessões protegidas', 'Controle do usuário'],
  },
  terms: {
    blocks: [
      { title: 'Uso da plataforma', text: 'Ao navegar, o usuário aceita uma experiência demonstrativa com produtos, pedidos e políticas fictícias.' },
      { title: 'Preços e estoque', text: 'Valores, descontos e disponibilidade podem variar no modo demo e não representam uma oferta comercial real.' },
      { title: 'Responsabilidades', text: 'A loja se comprometeria a comunicar prazos, políticas e limitações de forma clara antes da finalização da compra.' },
    ],
    notes: ['Uso demonstrativo', 'Catálogo fictício', 'Políticas simuladas'],
  },
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const pageKey = useMemo(() => pageKeyByPath[pathname] || 'contact', [pathname]);
  const content = pageContent[pageKey] ?? pageContent.contact;

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="container-premium">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-body font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-4"
          >
            Helô Modas
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-display font-bold text-foreground max-w-4xl leading-tight"
          >
            {t(`infoPages.${pageKey}.title`)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl text-base md:text-lg font-body text-muted-foreground leading-relaxed"
          >
            {t(`infoPages.${pageKey}.subtitle`)}
          </motion.p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-premium grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="h-full flex flex-col rounded-3xl border border-border/60 bg-secondary/30 p-8 md:p-10"
          >
            <p className="text-sm md:text-base font-body text-muted-foreground leading-relaxed max-w-2xl">
              {t(`infoPages.${pageKey}.body`)}
            </p>
            <div className="mt-8 grid gap-4">
              {content.blocks.map((block) => (
                <div key={block.title} className="rounded-2xl border border-border/60 bg-background/70 p-5">
                  <h2 className="text-base font-display font-semibold text-foreground">{block.title}</h2>
                  <p className="mt-2 text-sm font-body leading-relaxed text-muted-foreground">{block.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full flex flex-col rounded-3xl border border-border/60 bg-primary text-primary-foreground p-8 md:p-10"
          >
            <h2 className="text-2xl font-display font-bold mb-4">Helô Modas</h2>
            <p className="text-sm md:text-base font-body text-primary-foreground/70 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <Link to="/products" className="inline-flex items-center gap-3 text-sm font-body font-medium hover:opacity-90">
              {t('common.browseProducts')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-8 space-y-3 border-t border-primary-foreground/15 pt-6">
              {content.notes.map((note) => (
                <div key={note} className="flex items-center justify-between gap-4 text-sm text-primary-foreground/80">
                  <span>{note}</span>
                  <span className="h-px flex-1 bg-primary-foreground/15" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
