import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales & Politique de confidentialité | Où Va l\'Argent ?',
  description: 'Mentions légales, politique de confidentialité et gestion des données personnelles.',
}

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-bg-deep text-text-primary pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl mb-12">
          Mentions légales & <span className="italic text-accent-electric">Politique de confidentialité</span>
        </h1>

        {/* Mentions légales */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">1. Mentions légales</h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p><strong className="text-text-primary">Editeur du site :</strong> Emmanuel Blézès</p>
            <p><strong className="text-text-primary">Site :</strong> ouvalargent.com</p>
            <p><strong className="text-text-primary">Hébergement :</strong> Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
            <p><strong className="text-text-primary">Contact :</strong> contact@ouvalargent.com</p>
          </div>
        </section>

        {/* Politique de confidentialité */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">2. Politique de confidentialité</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679)
              et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, nous vous informons de la manière
              dont vos données personnelles sont collectées et traitées sur ce site.
            </p>
          </div>
        </section>

        {/* Données collectées */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">3. Données collectées</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>Nous collectons uniquement les données suivantes :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-text-primary">Adresse email</strong> — lors de votre inscription volontaire à la newsletter</li>
            </ul>
            <p>
              Aucune autre donnée personnelle n&apos;est collectée. Nous ne collectons pas de données de navigation,
              ne déposons pas de cookies publicitaires et n&apos;utilisons pas de trackers tiers.
            </p>
          </div>
        </section>

        {/* Finalité */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">4. Finalité du traitement</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>Votre adresse email est utilisée exclusivement pour :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Vous envoyer notre newsletter hebdomadaire (analyses économiques, infographies, actualités)</li>
              <li>Vous informer de l&apos;actualité du site ouvalargent.com</li>
            </ul>
            <p>
              <strong className="text-text-primary">Base légale :</strong> votre consentement explicite (article 6.1.a du RGPD),
              recueilli lors de la saisie de votre adresse email et la validation du formulaire d&apos;inscription.
            </p>
          </div>
        </section>

        {/* Sous-traitant */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">5. Sous-traitant</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>Les données collectées sont traitées par le service :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-text-primary">Formspree</strong> (formspree.io) — service de gestion de formulaires, basé aux Etats-Unis, conforme aux clauses contractuelles types de la Commission européenne pour les transferts de données</li>
            </ul>
          </div>
        </section>

        {/* Conservation */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">6. Durée de conservation</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              Vos données sont conservées tant que vous restez inscrit à la newsletter.
              Elles sont supprimées dans un délai de 30 jours suivant votre demande de désinscription.
            </p>
          </div>
        </section>

        {/* Droits */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">7. Vos droits</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-text-primary">Droit d&apos;accès</strong> — obtenir une copie de vos données</li>
              <li><strong className="text-text-primary">Droit de rectification</strong> — corriger vos données</li>
              <li><strong className="text-text-primary">Droit de suppression</strong> — demander l&apos;effacement de vos données</li>
              <li><strong className="text-text-primary">Droit d&apos;opposition</strong> — vous opposer au traitement</li>
              <li><strong className="text-text-primary">Droit à la portabilité</strong> — récupérer vos données dans un format lisible</li>
              <li><strong className="text-text-primary">Droit de retrait du consentement</strong> — vous désinscrire à tout moment</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@ouvalargent.com" className="text-accent-electric hover:underline">contact@ouvalargent.com</a>
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique
              et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent-electric hover:underline">www.cnil.fr</a>
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">8. Cookies</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du site
              (mémorisation de l&apos;inscription à la newsletter via localStorage). Aucun cookie publicitaire
              ou de suivi n&apos;est déposé.
            </p>
          </div>
        </section>

        {/* Mise à jour */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-accent-electric mb-4">9. Mise à jour</h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              Cette politique peut être mise à jour. La date de dernière modification est indiquée ci-dessous.
            </p>
            <p className="text-text-muted">Dernière mise à jour : 25 février 2026</p>
          </div>
        </section>
      </div>
    </main>
  )
}
