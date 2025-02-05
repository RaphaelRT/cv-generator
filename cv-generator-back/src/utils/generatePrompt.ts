import { cleanText } from "./fileUtils";

function getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
export function generatePrompt(
  jsonContent: string,
  gender: "male" | "female" | "other",
  offerContent: string,
  link: string
): string {
  const genderDict: { male: string; female: string; other: string } = {
    male: "un homme",
    female: "une femme",
    other: "une personne non-binaire",
  };

  const todayDate = getTodayDate();

  return cleanText(`
    Tu es un expert en rédaction de CV et en systèmes de suivi des candidatures (ATS). Voici un JSON représentant mon CV : ${cleanText(jsonContent)}.
    Ce JSON contient toutes les informations nécessaires pour un CV complet. Je souhaite que tu le mémorises. Voici le contenu de la page de l'offre : ${cleanText(offerContent)}. Fais attention, il peut y avoir des informations qui ne concernent pas mon offre sur la page, fais le tri et fais sous forme de bulletpoints un résumé. Ensuite, ton objectif sera de régénérer le contenu du JSON pour qu'il corresponde au mieux à l’offre d’emploi et optimise mes chances, en tant que développeur, d’être retenu.

    De plus, dans le JSON final, ajoute une section nommée "offer" contenant les informations suivantes :
      - Nom de l'annonce (title)
      - Résumé de l'annonce (résumé sur le poste au sein de l'entreprise, ce que je dois faire, pour qui et quelles sont les avantages) (summary)
      - Tes recommandation par rapport à mon profil vis à vis de l'annonce (si je doit travailler une compétence en particulier, si j'ai mes chances, quelles profil ils attendent, est ce qu'il paie correctement, etc.)(recommendations)
      - Lien de l'annonce (${link})
      - Nom de l'entreprise (company)
      - en quelque mot c'est une entreprise de quoi ? Que fait elle? comment gagne telle de l'argent ? combien d'employé ? son statut ? PME, etc ?  (company_description)
      - Date de publication de l'annonce que tu calculera si nécessaire (par exemple : posté il y a 3 jours, tu prend la date du jour et tu fait -3) nous somme aujourd'hui le ${new Date()} et je veux en format YYYY-MM-DD (posted_date)
      - Le nom de l'offre (job_title)
    
    Si la date de publication est donnée sous une forme relative (par exemple, "il y a une semaine" ou "il y a une heure"), calcule la date réelle en fonction de la date actuelle (${todayDate}) et insère-la au format AAAA-MM-JJ.

    Voici les règles à suivre pour cette tâche :
        1. Structure et contenu :
            - Ne modifie pas la section contact, sauf le champ title, que tu peux ajuster pour l’adapter à l’offre.
            - Conserve la structure du JSON : toutes les sections principales (contact, skills, experience, etc.) doivent rester présentes. Si une section n’est pas pertinente pour l’offre, laisse-la inchangée.
        2. Langue :
            - Le contenu doit être en français. Tu peux utiliser des termes techniques en anglais si cela est pertinent pour les systèmes ATS (par exemple : « React », « Agile », « CI/CD »).
        3. Expérience professionnelle :
            - Tu n’as pas le droit de supprimer une expérience existante, mais tu peux réécrire ou enrichir les descriptions pour mieux coller aux exigences et mots-clés de l’offre.
            - Si une compétence ou expérience essentielle mentionnée dans l’offre est absente du JSON, tu peux l’intégrer dans une description existante, tant que cela reste réaliste et cohérent.
        4. Compétences skills :
            - Tu peux réorganiser et reformuler les compétences, ajouter ou retirer des catégories, tant que cela reste pertinent par rapport à l’offre.
        5. Langage inclusif et genre :
            - Si l’offre utilise un langage inclusif (par exemple : « développeur·euse »), adapte les descriptions en fonction de mon identité de genre (${genderDict[gender]}).
        6. Objectivité :
            - L’objectif n’est pas de mentir ou d’inventer, mais de mettre en avant les compétences pertinentes mentionnées dans l’offre.
            - Si un élément te semble crucial dans l’offre, veille à l’intégrer au moins une fois dans les descriptions d’expérience (sans toucher aux intitulés de poste).
        7. Format attendu :
            - Je veux uniquement le nouveau JSON comme réponse, sans aucun commentaire ou contenu supplémentaire.
        8. Section "offer" :
            - Ajoute cette section au JSON final avec les informations de l'offre décrites ci-dessus.
        9. Analyse les descriptions des expériences listées dans le JSON ci-dessous et identifier les mots ou groupes de mots qui semblent pertinents vis-à-vis de l'offre d'emploi. Ces mots-clés seront ajoutés dans une nouvelle catégorie appelée keywords.Pour référence, voici une liste d'exemples de termes pertinents :
        MeteorJS, 
        ReactJS, 
        Node.js, 
        Kubernetes, 
        Vision par ordinateur, 
        etc.
        Ces termes doivent apparaître sous forme de liste de chaînes de caractères (keywords) au niveau de chaque expérience concernée.
        10. tu ne mettra pas les termes Sénior, Junior, confirmé, etc. ni ce qui concerne le lieu de travail comme hybride par exemple
        11. tu écriras comme un humain

    Quelques précisions supplémentaires pour éviter toute ambiguïté :
        - Cas des sections manquantes : Si une section du JSON est absente de l’offre, ne la modifie pas. Si elle est vide, laisse-la inchangée à moins que tu puisses y ajouter des informations pertinentes.
        - Descriptions professionnelles : Toute modification ou ajout dans les descriptions d’expérience doit être logique et aligné avec le contexte professionnel indiqué (par exemple : la chronologie et les entreprises mentionnées).
        - Skills : Mets en avant les compétences clés pour l’offre, mais ne surcharge pas inutilement cette section.
        - Ton professionnel : Assure-toi que toutes les modifications respectent un ton professionnel et cohérent avec un CV.

    Ton objectif principal est de maximiser les chances que ce CV passe les filtres ATS et attire l’attention des recruteurs tout en restant fidèle à mes compétences et expériences réelles.
  `);
}
