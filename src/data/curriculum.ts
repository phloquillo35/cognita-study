import { Subject, SubjectCategory } from "@/types";

export interface CurriculumData {
  university: string;
  career: string;
  plan: string;
  levels: LevelData[];
}

export interface LevelData {
  level: number;
  name: string;
  totalHours: number;
  weeklyHours: number;
  maxRecoveryNote: number;
  subjects: Subject[];
}

export const CURRICULUM: CurriculumData = {
  university: "UTN - Facultad Regional Tucumán",
  career: "Ingeniería en Sistemas de Información",
  plan: "Plan 2023 (Ordenanza 1877)",
  levels: [
    {
      level: 1,
      name: "Primer Año",
      totalHours: 768,
      weeklyHours: 32,
      maxRecoveryNote: 60,
      subjects: [
        {
          id: "am1",
          name: "Análisis Matemático I",
          code: "ISI-101",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 5,
          hoursPerWeek: 5,
          totalHours: 120,
          recoveryNote: 10,
          description: "Formar al estudiante en el cálculo diferencial e integral de funciones de una variable. Provee las herramientas matemáticas básicas para plantear modelos matemáticos que describan problemas del mundo real.",
          category: "math" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 10,
          keyConcepts: ["Derivación e integración", "Límites y continuidad", "Teoremas del valor medio", "Taylor y series", "Optimización de funciones"],
          prerequisites: [],
          bibliography: {
            official: [
              "Stewart, J. Cálculo de una Variable: Trascendentes Tempranas. 8ª edición. Pearson.",
              "Anton, H. Cálculo con Geometría Analítica. 2ª edición. McGraw-Hill.",
              "Larsen, R. Análisis Matemático. McGraw-Hill."
            ],
            complementary: [
              "Bárcena, S. Guía de Ejercicios de Análisis Matemático I. EUA-UTN.",
              "Leithold, L. El Cálculo con Geometría Analítica. Harla.",
              "Spivak, M. Cálculo. Gedisa."
            ]
          },
          methodology: {
            theory: "Clase teórica magistral donde el profesor explica conceptos, demuestra teoremas y resuelve ejercicios modelo en el pizarrón.",
            practice: "Clase práctica con ejercicios progresivos de dificultad creciente, donde los estudiantes resuelven problemas guiados por el docente.",
            activities: [
              "Resolución de ejercicios en clase",
              "Trabajos Prácticos (TP) individuales y grupales",
              "Guías de ejercicios para resolver en casa",
              "Consultas y tutorías obligatorias",
              "Simulacros de examen parcial"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo). Aprobar los Trabajos Prácticos asignados.",
            promotion: "Examen final escrito u oral. Para presentarse se requiere regularidad (2 parciales aprobados). La nota del final reemplaza o complementa la cursada.",
            recovery: "Recuperatorio oportunidad 1: primer semestre del año siguiente. Oportunidad 2: según reglamento de la facultad.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos (20% de la nota de cursada)",
              "Examen final escrito (100% de la nota final)"
            ]
          },
          objectives: [
            "Dominar las técnicas de cálculo diferencial e integral de funciones de una variable.",
            "Aplicar los teoremas del valor medio para resolver problemas de optimización.",
            "Resolver integrales definidas e impropias utilizando métodos analíticos y numéricos.",
            "Desarrollar el polinomio de Taylor y analizar series de potencias.",
            "Formular modelos matemáticos de problemas del mundo real usando cálculo."
          ],
          competencies: [
            "Calcular derivadas e integrales de funciones elementales y compuestas.",
            "Resolver problemas de optimización aplicando teoremas del valor medio.",
            "Analizar la convergencia de series numéricas y de potencias.",
            "Aplicar integración numérica para aproximar áreas y volúmenes.",
            "Interpretar resultados matemáticos en contexto de ingeniería."
          ],
          partialExamples: [
            {
              topic: "Límites y derivadas",
              question: "Calcular el límite: lim(x→0) (sin(3x) - 3x + x³) / x⁵",
              difficulty: 4,
              solution: "Aplicar la serie de Taylor de sin(3x) = 3x - (3x)³/6 + (3x)⁵/120 - ... Sustituyendo y simplificando los términos se obtiene el valor del límite."
            },
            {
              topic: "Integración",
              question: "Calcular: ∫₀¹ x²·eˣ dx",
              difficulty: 3,
              solution: "Integración por partes dos veces: resultado e - 2 ≈ 0.718."
            }
          ],
          topics: [
            { id: "am1-1", subjectId: "am1", name: "Números reales y topología", description: "Propiedades de los números reales, conjuntos numéricos, topología de la recta real", difficulty: 2, estimatedMinutes: 120 },
            { id: "am1-2", subjectId: "am1", name: "Sucesiones y series numéricas", description: "Convergencia de sucesiones, criterios, series numéricas", difficulty: 3, estimatedMinutes: 180 },
            { id: "am1-3", subjectId: "am1", name: "Funciones de una variable", description: "Definición, dominio, rango, composición, inversa, funciones elementales", difficulty: 2, estimatedMinutes: 120 },
            { id: "am1-4", subjectId: "am1", name: "Continuidad de funciones", description: "Definición, discontinuidad, teorema del valor intermedio", difficulty: 2, estimatedMinutes: 140 },
            { id: "am1-5", subjectId: "am1", name: "Límites funcionales e indeterminaciones", description: "Límites laterales, indeterminaciones, L'Hôpital", difficulty: 3, estimatedMinutes: 180 },
            { id: "am1-6", subjectId: "am1", name: "Derivada y diferencial: definición y reglas de cálculo", description: "Definición, reglas de derivación, cadena, derivadas elementales", difficulty: 3, estimatedMinutes: 200 },
            { id: "am1-7", subjectId: "am1", name: "Teoremas del valor medio (Rolle, Lagrange, Cauchy)", description: "Enunciado, demostración, aplicaciones", difficulty: 4, estimatedMinutes: 160 },
            { id: "am1-8", subjectId: "am1", name: "Análisis de variación de funciones", description: "Monotonía, máximos y mínimos, convexidad, asíntotas", difficulty: 3, estimatedMinutes: 200 },
            { id: "am1-9", subjectId: "am1", name: "Desarrollo de Taylor y series de potencias", description: "Polinomio de Taylor, remainder, radio de convergencia", difficulty: 4, estimatedMinutes: 200 },
            { id: "am1-10", subjectId: "am1", name: "Integral indefinida: técnicas de integración", description: "Primitivas, sustitución, partes, fracciones parciales, trigonométricas", difficulty: 3, estimatedMinutes: 200 },
            { id: "am1-11", subjectId: "am1", name: "Integral definida y teorema fundamental", description: "Riemann, teorema fundamental, áreas, volúmenes", difficulty: 3, estimatedMinutes: 180 },
            { id: "am1-12", subjectId: "am1", name: "Integrales impropias", description: "Integrales con infinitos, convergencia, criterios", difficulty: 4, estimatedMinutes: 140 },
            { id: "am1-13", subjectId: "am1", name: "Integración numérica", description: "Trapecio, Simpson, cuadratura gaussiana, error", difficulty: 3, estimatedMinutes: 140 },
          ],
        },
        {
          id: "aga",
          name: "Álgebra y Geometría Analítica",
          code: "ISI-102",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 5,
          hoursPerWeek: 5,
          totalHours: 120,
          recoveryNote: 10,
          description: "Proporcionar conocimientos de álgebra lineal y geometría analítica para resolver problemas de ingeniería.",
          category: "math" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 10,
          keyConcepts: ["Vectores y operaciones vectoriales", "Sistemas de ecuaciones lineales", "Álgebra de matrices", "Determinantes", "Espacios vectoriales", "Autovalores y autovectores", "Geometría analítica del espacio"],
          prerequisites: [],
          bibliography: {
            official: [
              "Grossi, G. Álgebra y Geometría Analítica. EUA-UTN.",
              "Larson, R. Álgebra Lineal. Cengage Learning.",
              "Nakamaki, L. Álgebra Lineal con Geometría Analítica. McGraw-Hill."
            ],
            complementary: [
              "Anton, H. Álgebra Lineal. Wiley.",
              "Strang, G. Introducción al Álgebra Lineal. Editorial Reverte.",
              "Boldrini, J.L. Álgebra Lineal. Ed. Moderna."
            ]
          },
          methodology: {
            theory: "Clase teórica con desarrollo de conceptos algebraicos, demostraciones de teoremas y ejemplos resueltos.",
            practice: "Clase práctica enfocada en resolución de ejercicios de sistemas lineales, matrices, determinantes y geometría analítica.",
            activities: [
              "Resolución de sistemas de ecuaciones con métodos de Gauss y Jordan",
              "Cálculo de determinantes y matrices inversas",
              "Trabajos Prácticos de Geometría Analítica",
              "Ejercicios de autovalores y diagonalización",
              "Talleres de resolución colaborativa"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito u oral. Requiere regularidad (2 parciales aprobados).",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos (20% de la nota de cursada)",
              "Examen final escrito (100% de la nota final)"
            ]
          },
          objectives: [
            "Resolver sistemas de ecuaciones lineales utilizando métodos matriciales.",
            "Calcular determinantes, inversas y rangos de matrices.",
            "Comprender los conceptos de espacio vectorial y transformación lineal.",
            "Determinar autovalores y autovectores y diagonalizar matrices.",
            "Aplicar la geometría analítica para resolver problemas de planos y rectas."
          ],
          competencies: [
            "Aplicar métodos de Gauss y Jordan para resolver sistemas de ecuaciones.",
            "Calcular determinantes y determinar inversas de matrices.",
            "Analizar espacios vectoriales, bases y dimensiones.",
            "Resolver problemas geométricos de rectas, planos y superficies cuádicas.",
            "Aplicar autovalores y autovectores a problemas de ingeniería."
          ],
          partialExamples: [
            {
              topic: "Matrices y determinantes",
              question: "Calcular la inversa de la matriz A = [[2,1,3],[0,-1,2],[1,3,4]] y resolver AX = B.",
              difficulty: 3,
              solution: "Calcular det(A) = -15. La inversa se calcula con la matriz adjunta dividida por el determinante. Luego X = A⁻¹B."
            },
            {
              topic: "Autovalores y autovectores",
              question: "Determinar los autovalores de la matriz A = [[4,1],[2,3]].",
              difficulty: 3,
              solution: "Polinomio característico: λ² - 7λ + 10 = (λ-5)(λ-2) = 0. Autovalores: λ₁ = 5, λ₂ = 2."
            }
          ],
          topics: [
            { id: "aga-1", subjectId: "aga", name: "Vectores en el plano y espacio", description: "Definición, operaciones, base, productos escalar, vectorial y mixto", difficulty: 2, estimatedMinutes: 180 },
            { id: "aga-2", subjectId: "aga", name: "Sistemas de ecuaciones lineales", description: "Métodos de Gauss y Jordan, Cramer, compatibilidad", difficulty: 2, estimatedMinutes: 200 },
            { id: "aga-3", subjectId: "aga", name: "Matrices: operaciones, determinante, inversa", description: "Operaciones, determinante, inversa, rangos", difficulty: 3, estimatedMinutes: 220 },
            { id: "aga-4", subjectId: "aga", name: "Espacios vectoriales y subespacios", description: "Base, dimensión, combinaciones lineales, isomorfismos", difficulty: 3, estimatedMinutes: 240 },
            { id: "aga-5", subjectId: "aga", name: "Transformaciones lineales", description: "Núcleo e imagen, matriz de transformación, teorema de la dimensión", difficulty: 3, estimatedMinutes: 200 },
            { id: "aga-6", subjectId: "aga", name: "Autovalores, autovectores y diagonalización", description: "Polinomio característico, diagonalización, formas canónicas", difficulty: 4, estimatedMinutes: 240 },
            { id: "aga-7", subjectId: "aga", name: "Rectas y planos en el espacio", description: "Ecuaciones, ángulos, distancias, intersecciones", difficulty: 3, estimatedMinutes: 180 },
            { id: "aga-8", subjectId: "aga", name: "Curvas y superficies cuádicas", description: "Elipse, hipérbola, parábola, superficies de segundo grado", difficulty: 4, estimatedMinutes: 200 },
          ],
        },
        {
          id: "fis1",
          name: "Física I",
          code: "ISI-103",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 5,
          hoursPerWeek: 5,
          totalHours: 120,
          recoveryNote: 10,
          description: "Comprender los fenómenos y leyes relativas a la mecánica clásica.",
          category: "physics" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 10,
          keyConcepts: ["Leyes de Newton", "Cinemática y dinámica", "Conservación de energía y momento", "Trabajo y energía", "Oscilaciones y ondas", "Fluidos"],
          prerequisites: [],
          bibliography: {
            official: [
              "Sears, F. & Zemansky, M. Física Universitaria. 15ª edición. Pearson.",
              "Halliday, D., Resnick, R. & Walker, J. Fundamentos de Física. 11ª edición. Wiley.",
              "Tippens, P. Física: Conceptos y Aplicaciones. 3ª edición. McGraw-Hill."
            ],
            complementary: [
              "Young, H. & Freedman, R. Física Universitaria con Física Moderna. Pearson.",
              "Beer, F. & Johnston, E. Estática y Dinámica. McGraw-Hill.",
              "Profont, M. Guía de Problemas de Física I. EUA-UTN."
            ]
          },
          methodology: {
            theory: "Clase teórica magistral con explicación de leyes físicas, derivación de fórmulas y ejemplos resueltos de mecánica.",
            practice: "Clase práctica con resolución de problemas de cinemática, dinámica, energía y momento.",
            activities: [
              "Resolución de problemas de mecánica en clase",
              "Trabajos Prácticos de laboratorio de física",
              "Guías de ejercicios obligatorias",
              "Experimentos de laboratorio",
              "Simulaciones de fenómenos físicos"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito con ejercicios de mecánica. Requiere regularidad.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos y laboratorio (20%)",
              "Examen final escrito (100% de la nota final)"
            ]
          },
          objectives: [
            "Aplicar las leyes de Newton para analizar el movimiento de cuerpos.",
            "Resolver problemas de conservación de energía y momento.",
            "Analizar el movimiento oscilatorio y ondas elásticas.",
            "Comprender el comportamiento de fluidos en equilibrio y en movimiento."
          ],
          competencies: [
            "Plantear y resolver problemas de cinemática y dinámica.",
            "Aplicar principios de conservación (energía, momento).",
            "Analizar sistemas oscilatorios y ondas.",
            "Resolver problemas de fluidos estáticos y dinámicos."
          ],
          partialExamples: [
            {
              topic: "Dinámica de la partícula",
              question: "Un bloque de 5 kg desliza por un plano inclinado de 30° con μ = 0.2. Calcular la aceleración.",
              difficulty: 3,
              solution: "a = g·sin30° - μ·g·cos30° = 9.8·0.5 - 0.2·9.8·0.866 = 3.2 m/s²."
            },
            {
              topic: "Conservación de energía",
              question: "Una pelota de 0.5 kg se lanza con v₀ = 15 m/s verticalmente. Altura máxima.",
              difficulty: 2,
              solution: "h = v₀²/(2g) = 225/19.6 ≈ 11.48 m."
            }
          ],
          topics: [
            { id: "fis1-1", subjectId: "fis1", name: "Cinemática del punto", description: "Movimiento rectilíneo, parabólico, circular", difficulty: 2, estimatedMinutes: 180 },
            { id: "fis1-2", subjectId: "fis1", name: "Movimiento relativo", description: "Transformaciones de Galileo, composición de movimientos", difficulty: 3, estimatedMinutes: 140 },
            { id: "fis1-3", subjectId: "fis1", name: "Leyes de Newton", description: "Primera, segunda y tercera ley, tipos de fuerzas", difficulty: 2, estimatedMinutes: 200 },
            { id: "fis1-4", subjectId: "fis1", name: "Dinámica de la partícula", description: "Trabajo, energía cinética, fuerzas conservativas", difficulty: 3, estimatedMinutes: 200 },
            { id: "fis1-5", subjectId: "fis1", name: "Dinámica de los sistemas", description: "Cantidad de movimiento, impulso, colisiones, centro de masa", difficulty: 3, estimatedMinutes: 200 },
            { id: "fis1-6", subjectId: "fis1", name: "Cinemática del sólido rígido", description: "Traslación, rotación, movimiento general", difficulty: 3, estimatedMinutes: 160 },
            { id: "fis1-7", subjectId: "fis1", name: "Dinámica del sólido rígido", description: "Momento de inercia, torque, energía rotatoria", difficulty: 4, estimatedMinutes: 220 },
            { id: "fis1-8", subjectId: "fis1", name: "Estática", description: "Equilibrio, centros de masa, momentos compuestos", difficulty: 3, estimatedMinutes: 140 },
            { id: "fis1-9", subjectId: "fis1", name: "Elasticidad y deformación", description: "Módulo de Young, esfuerzo, deformación", difficulty: 3, estimatedMinutes: 120 },
            { id: "fis1-10", subjectId: "fis1", name: "Movimiento oscilatorio", description: "MAS, resorte, péndulo, amortiguadas", difficulty: 3, estimatedMinutes: 160 },
            { id: "fis1-11", subjectId: "fis1", name: "Ondas elásticas", description: "Ondas mecánicas, reflexión, interferencia, resonancia", difficulty: 3, estimatedMinutes: 140 },
            { id: "fis1-12", subjectId: "fis1", name: "Fluidos en equilibrio", description: "Presión, Pascal, Arquímedes, capilaridad", difficulty: 2, estimatedMinutes: 140 },
            { id: "fis1-13", subjectId: "fis1", name: "Dinámica de fluidos", description: "Continuidad, Bernoulli, viscosidad, Reynolds", difficulty: 3, estimatedMinutes: 160 },
            { id: "fis1-14", subjectId: "fis1", name: "Óptica geométrica", description: "Reflexión, refracción, lentes, espejos", difficulty: 3, estimatedMinutes: 140 },
          ],
        },
        {
          id: "eng1",
          name: "Inglés I",
          code: "ISI-104",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 2,
          hoursPerWeek: 2,
          totalHours: 48,
          recoveryNote: 3,
          description: "Desarrollar competencias comunicativas en inglés enfocado en la lectura comprensiva de textos técnicos.",
          category: "general" as SubjectCategory,
          difficulty: 2,
          studyHoursPerWeek: 4,
          keyConcepts: ["Gramática inglesa fundamental", "Vocabulario técnico", "Lectura comprensiva"],
          prerequisites: [],
          bibliography: {
            official: [
              "Richards, J. & Hull, J. Interchange Intro. Cambridge University Press.",
              "Folse, K. & Grabe, W. Technical English. National Geographic Learning.",
              "Barlow, M. English for Computer Science. Oxford University Press."
            ],
            complementary: [
              "Swan, M. Practical English Usage. Oxford University Press.",
              "Murphy, R. English Grammar in Use. Cambridge University Press.",
              "Carr, J. English for Computing. Pearson."
            ]
          },
          methodology: {
            theory: "Clase centrada en la explicación de estructuras gramaticales y vocabulario técnico.",
            practice: "Actividades de comprensión lectora, ejercicios de escritura técnica, debates y presentaciones en inglés.",
            activities: [
              "Lectura y análisis de textos técnicos en inglés",
              "Ejercicios de gramática y vocabulario",
              "Escritura de emails y reportes técnicos",
              "Comprensión auditiva con podcasts y videos",
              "Presentaciones orales en inglés"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito y oral que evalúa comprensión lectora, escritura y escucha.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos de escritura y lectura (20%)",
              "Examen final escrito y oral (100% de la nota final)"
            ]
          },
          objectives: [
            "Desarrollar habilidades de lectura comprensiva de textos técnicos en inglés.",
            "Adquirir vocabulario técnico de ingeniería y tecnología.",
            "Estructurar escritos técnicos: emails, reportes y descripciones.",
            "Mejorar la comprensión auditiva de conferencias técnicas."
          ],
          competencies: [
            "Leer y comprender artículos técnicos en inglés a nivel intermedio.",
            "Redactar documentos técnicos básicos en inglés.",
            "Comprender audiciones técnicas y participar en conversaciones simples.",
            "Utilizar vocabulario técnico de ingeniería en contexto."
          ],
          partialExamples: [
            {
              topic: "Comprensión lectora",
              question: "Read about cloud computing and answer: What are the main advantages of IaaS?",
              difficulty: 2,
              solution: "Main advantages: no upfront hardware investment, scalability on demand, reduced maintenance, global accessibility."
            },
            {
              topic: "Escritura técnica",
              question: "Write a formal email requesting a meeting with a client to discuss software requirements.",
              difficulty: 2,
              solution: "Subject line, greeting, purpose, proposed times, closing with best regards."
            }
          ],
          topics: [
            { id: "eng1-1", subjectId: "eng1", name: "Gramática inglesa básica", description: "Tiempos verbales, condicionales, voz pasiva", difficulty: 1, estimatedMinutes: 140 },
            { id: "eng1-2", subjectId: "eng1", name: "Vocabulario técnico de ingeniería", description: "Términos básicos de ingeniería y tecnología", difficulty: 1, estimatedMinutes: 100 },
            { id: "eng1-3", subjectId: "eng1", name: "Lectura comprensiva de textos técnicos", description: "Técnicas de lectura, ideas principales, inferencias", difficulty: 2, estimatedMinutes: 120 },
            { id: "eng1-4", subjectId: "eng1", name: "Comprensión auditiva básica", description: "Listening exercises, entrevistas técnicas", difficulty: 2, estimatedMinutes: 100 },
            { id: "eng1-5", subjectId: "eng1", name: "Producción escrita técnica", description: "Emails, reportes, descripciones técnicas", difficulty: 2, estimatedMinutes: 100 },
          ],
        },
        {
          id: "led",
          name: "Lógica y Estructuras Discretas",
          code: "ISI-105",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Lógica proposicional y de predicados, teoría de conjuntos, relaciones, estructuras algebraicas y teoría de grafos.",
          category: "cs" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 6,
          keyConcepts: ["Lógica proposicional y demostraciones", "Teoría de conjuntos", "Inducción matemática", "Relaciones", "Estructuras algebraicas", "Teoría de grafos", "Álgebra de Boole"],
          prerequisites: [],
          bibliography: {
            official: [
              "Rosen, K. Matemáticas Discretas y sus Aplicaciones. 8ª edición. McGraw-Hill.",
              "Brualdi, R. Introductory Combinatorics. Pearson.",
              "Ercolano, J. Lógica y Matemáticas Discretas. EUA-UTN."
            ],
            complementary: [
              "Simpson, A. Introducción a la Lógica Matemática. UNR Editora.",
              "Epp, S. Matemáticas Discretas con Aplicaciones. Cengage.",
              "Burton, D. Teoría de Números y Álgebra Abstracta. Pearson."
            ]
          },
          methodology: {
            theory: "Clase teórica con demostraciones formales, definiciones matemáticas y resolución de problemas de lógica.",
            practice: "Clase práctica con ejercicios de lógica proposicional, inducción matemática, combinatoria y grafos.",
            activities: [
              "Demostraciones formales de proposiciones",
              "Resolución de problemas de inducción matemática",
              "Trabajos Prácticos de teoría de grafos",
              "Ejercicios de árboles de verdad y circuitos lógicos",
              "Resolución de problemas combinatorios"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito con ejercicios de lógica, grafos y demostración.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos (20%)",
              "Examen final escrito (100% de la nota final)"
            ]
          },
          objectives: [
            "Dominar la lógica proposicional y de predicados.",
            "Aplicar el principio de inducción para demostrar proposiciones.",
            "Resolver problemas de analítica combinatoria.",
            "Analizar relaciones, equivalencias y órdenes.",
            "Aplicar la teoría de grafos a problemas de la ingeniería."
          ],
          competencies: [
            "Construir tablas de verdad y demostrar tautologías.",
            "Formular argumentos lógicos formales con reglas de inferencia.",
            "Aplicar inducción matemática para demostraciones.",
            "Resolver problemas combinatorios con permutaciones y combinaciones.",
            "Analizar grafos: recorridos, árboles y planaridad."
          ],
          partialExamples: [
            {
              topic: "Lógica proposicional",
              question: "Demostrar que (p → q) ∧ (q → r) → (p → r) es una tautología.",
              difficulty: 3,
              solution: "Tabla de verdad con 8 filas, verificar columna resultante siempre V."
            },
            {
              topic: "Inducción matemática",
              question: "Demostrar: 1 + 2 + ... + n = n(n+1)/2.",
              difficulty: 3,
              solution: "Base n=1: 1=1. Hipótesis n=k. Paso n=k+1: k(k+1)/2+(k+1)=(k+1)(k+2)/2."
            }
          ],
          topics: [
            { id: "led-1", subjectId: "led", name: "Lógica proposicional", description: "Conectores, tablas de verdad, equivalencias, tautologías", difficulty: 2, estimatedMinutes: 180 },
            { id: "led-2", subjectId: "led", name: "Sistemas de inferencia", description: "Reglas de inferencia, demostraciones formales", difficulty: 3, estimatedMinutes: 160 },
            { id: "led-3", subjectId: "led", name: "Lógica de predicados", description: "Cuantificadores, negación, traducción del lenguaje natural", difficulty: 3, estimatedMinutes: 200 },
            { id: "led-4", subjectId: "led", name: "Teoría de conjuntos", description: "Operaciones, particiones, productos cartesianos, cardinalidad", difficulty: 2, estimatedMinutes: 140 },
            { id: "led-5", subjectId: "led", name: "Principios de inducción", description: "Inducción fuerte y débil, bien ordenación, recursión", difficulty: 4, estimatedMinutes: 160 },
            { id: "led-6", subjectId: "led", name: "Análisis combinatorio", description: "Aditivo, multiplicativo, permutaciones, combinaciones, pigeonhole", difficulty: 3, estimatedMinutes: 180 },
            { id: "led-7", subjectId: "led", name: "Relaciones y propiedades", description: "Reflexividad, simetría, transitividad, cierre, equivalencia, orden", difficulty: 3, estimatedMinutes: 180 },
            { id: "led-8", subjectId: "led", name: "Estructuras algebraicas", description: "Grupos, anillos, cuerpos, homomorfismos", difficulty: 4, estimatedMinutes: 200 },
            { id: "led-9", subjectId: "led", name: "Látices y álgebras de Boole", description: "Látices, retículos, álgebras de Boole, circuitos lógicos", difficulty: 4, estimatedMinutes: 180 },
            { id: "led-10", subjectId: "led", name: "Teoría de grafos", description: "Definición, tipos, recorridos, árboles, planaridad, coloreo", difficulty: 3, estimatedMinutes: 220 },
            { id: "led-11", subjectId: "led", name: "Relaciones de recurrencia", description: "Ecuaciones de recurrencia, resolución lineal, aplicación al conteo", difficulty: 4, estimatedMinutes: 160 },
          ],
        },
        {
          id: "aed",
          name: "Algoritmos y Estructuras de Datos",
          code: "ISI-106",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 5,
          hoursPerWeek: 5,
          totalHours: 120,
          recoveryNote: 10,
          description: "Programación estructurada, diseño de algoritmos y estructuras de datos para la resolución eficiente de problemas.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 12,
          keyConcepts: ["Diseño de algoritmos", "Estructuras de datos", "Recursividad", "Búsqueda y ordenamiento", "Complejidad algorítmica", "TAD"],
          prerequisites: [],
          bibliography: {
            official: [
              "Weiss, M. Estructuras de Datos y Algoritmos. 4ª edición. Pearson.",
              "Sedgewick, R. Algorithms. 4ª edición. Addison-Wesley.",
              "Cormen, T. et al. Introduction to Algorithms (CLRS). 4ª edición. MIT Press."
            ],
            complementary: [
              "Skiena, S. The Algorithm Design Manual. Springer.",
              "Horowitz, E. & Sahni, S. Fundamentals of Computer Algorithms. CBS Publishers.",
              "Ercolano, J. Guía de Ejercicios de AED. EUA-UTN."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre estructuras de datos, algoritmos de búsqueda y ordenamiento, y complejidad.",
            practice: "Laboratorio de programación con implementación en Java de estructuras de datos y algoritmos.",
            activities: [
              "Implementación de estructuras de datos en Java",
              "Análisis de complejidad temporal y espacial",
              "Resolución de ejercicios algorítmicos",
              "Trabajos Prácticos programados",
              "Implementación de algoritmos de ordenamiento y búsqueda"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito y práctico con diseño de algoritmos y análisis de complejidad.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos programados (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Diseñar algoritmos eficientes utilizando diseño descendente.",
            "Implementar y manipular estructuras de datos: listas, pilas, colas, árboles y grafos.",
            "Analizar la complejidad temporal y espacial de algoritmos.",
            "Aplicar recursividad para resolver problemas computacionales.",
            "Seleccionar la estructura de datos más adecuada para cada problema."
          ],
          competencies: [
            "Diseñar soluciones algorítmicas con pseudocódigo y diagramas de flujo.",
            "Implementar estructuras de datos lineales y jerárquicas en Java.",
            "Analizar complejidad algorítmica con notación O, Ω, Θ.",
            "Implementar algoritmos de búsqueda y ordenamiento.",
            "Resolver problemas de grafos con BFS y DFS."
          ],
          partialExamples: [
            {
              topic: "Complejidad algorítmica",
              question: "Analizar complejidad de doble for con j=i.",
              difficulty: 3,
              solution: "Total iteraciones: n(n+1)/2 = O(n²)."
            },
            {
              topic: "Recursividad",
              question: "Función recursiva factorial y su complejidad.",
              difficulty: 2,
              solution: "O(n) temporal, O(n) espacial por pila de llamadas."
            }
          ],
          topics: [
            { id: "aed-1", subjectId: "aed", name: "Introducción a la computación", description: "Modelo de Von Neumann, hardware y software, lenguajes", difficulty: 1, estimatedMinutes: 120 },
            { id: "aed-2", subjectId: "aed", name: "Metodología de diseño descendente", description: "Partición, refinamiento, pseudocódigo, documentación", difficulty: 2, estimatedMinutes: 140 },
            { id: "aed-3", subjectId: "aed", name: "Algoritmia: pseudocódigo y diagramas de flujo", description: "Representación gráfica y textual de algoritmos", difficulty: 2, estimatedMinutes: 160 },
            { id: "aed-4", subjectId: "aed", name: "Estructuras de datos elementales", description: "Arrays, pilas, colas, listas, complejidad", difficulty: 2, estimatedMinutes: 180 },
            { id: "aed-5", subjectId: "aed", name: "Listas enlazadas", description: "Simple, doble, circular, inserción, eliminación", difficulty: 3, estimatedMinutes: 200 },
            { id: "aed-6", subjectId: "aed", name: "Árboles", description: "ABB, AVL, balanceados, recorridos, inserción, eliminación", difficulty: 4, estimatedMinutes: 280 },
            { id: "aed-7", subjectId: "aed", name: "Grafos: representación y recorridos", description: "Matriz de adyacencia, lista, BFS, DFS", difficulty: 4, estimatedMinutes: 260 },
            { id: "aed-8", subjectId: "aed", name: "Algoritmos de búsqueda", description: "Lineal, binaria, hashing", difficulty: 2, estimatedMinutes: 140 },
            { id: "aed-9", subjectId: "aed", name: "Algoritmos de ordenamiento", description: "Bubble, selection, insertion, merge, quick, heap sort", difficulty: 3, estimatedMinutes: 260 },
            { id: "aed-10", subjectId: "aed", name: "Complejidad algorítmica", description: "Notación O, Ω, Θ, análisis de casos", difficulty: 3, estimatedMinutes: 160 },
            { id: "aed-11", subjectId: "aed", name: "Recursividad", description: "Principio recursivo, pila de llamadas, recursión de cola", difficulty: 3, estimatedMinutes: 160 },
            { id: "aed-12", subjectId: "aed", name: "Tipos abstractos de datos", description: "TAD lista, pila, cola, diccionario, conjunto", difficulty: 3, estimatedMinutes: 180 },
          ],
        },
        {
          id: "arq",
          name: "Arquitectura de Computadoras",
          code: "ISI-107",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 6,
          description: "Organización de computadoras, representación numérica, circuitos digitales, memorias y programación en ensamblador.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 8,
          keyConcepts: ["Representación numérica", "Circuitos digitales", "Arquitectura de Von Neumann", "Memorias", "ALU", "Ensamblador", "CISC/RISC"],
          prerequisites: [],
          bibliography: {
            official: [
              "Stallings, W. Computer Organization and Architecture. 11ª edición. Pearson.",
              "Tanenbaum, A. Structured Computer Organization. 6ª edición. Pearson.",
              "Hamacher, V. Computer Organization: Hardware/Software. 5ª edición. McGraw-Hill."
            ],
            complementary: [
              "Patterson, D. & Hennessy, J. Computer Organization and Design. Morgan Kaufmann.",
              "Mano, M. Digital Design. 5ª edición. Pearson.",
              "Cerda, R. Guía Práctica de Arquitectura. EUA-UTN."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre organización interna de computadoras, representación numérica y circuitos digitales.",
            practice: "Laboratorio de ensamblador y diseño digital con herramientas de simulación (Logisim, MARS).",
            activities: [
              "Ejercicios de conversiones numéricas",
              "Diseño de circuitos digitales",
              "Programación en ensamblador MIPS",
              "Trabajos prácticos de laboratorio",
              "Análisis de arquitecturas de procesadores"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito y práctico de ensamblador.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender la representación numérica y su impacto en el cálculo.",
            "Diseñar circuitos digitales combinacionales y secuenciales.",
            "Programar en lenguaje ensamblador a nivel básico.",
            "Analizar la organización interna de las computadoras.",
            "Comprender la jerarquía de memorias y su influencia en el rendimiento."
          ],
          competencies: [
            "Realizar conversiones entre sistemas numéricos.",
            "Diseñar circuitos digitales con puertas lógicas y flip-flops.",
            "Programar rutinas básicas en ensamblador.",
            "Analizar la arquitectura de un procesador.",
            "Evaluar el rendimiento de una computadora."
          ],
          partialExamples: [
            {
              topic: "Representación numérica",
              question: "Convertir 42.375 a binario y al formato IEEE 754.",
              difficulty: 4,
              solution: "42 = 101010₂, 0.375 = 0.011₂. IEEE 754: 0 10000100 01010011000000000000000."
            },
            {
              topic: "Ensamblador",
              question: "Escribir un programa en ensamblador MIPS que calcule el factorial de un número n.",
              difficulty: 4,
              solution: "Usar un loop que multiplique acumulador por n y decremente n hasta llegar a 0."
            }
          ],
          topics: [
            { id: "arq-1", subjectId: "arq", name: "Sistemas numéricos y conversiones", description: "Binario, octal, hexadecimal, decimal, conversiones", difficulty: 1, estimatedMinutes: 140 },
            { id: "arq-2", subjectId: "arq", name: "Circuitos lógicos y digitales", description: "Puertas lógicas, tablas de verdad, simplificación", difficulty: 2, estimatedMinutes: 200 },
            { id: "arq-3", subjectId: "arq", name: "Códigos y representaciones", description: "ASCII, Unicode, BCD, códigos de error", difficulty: 2, estimatedMinutes: 140 },
            { id: "arq-4", subjectId: "arq", name: "Punto fijo y flotante", description: "Punto fijo, IEEE 754, operaciones", difficulty: 3, estimatedMinutes: 160 },
            { id: "arq-5", subjectId: "arq", name: "Sistemas digitales combinacionales y secuenciales", description: "Multiplexores, flip-flops, contadores, registros", difficulty: 3, estimatedMinutes: 200 },
            { id: "arq-6", subjectId: "arq", name: "Memorias electrónicas", description: "RAM, ROM, FLASH, jerarquía, cache", difficulty: 3, estimatedMinutes: 160 },
            { id: "arq-7", subjectId: "arq", name: "Arquitectura de Von Neumann", description: "Organización, buses, ciclo fetch-decode-execute", difficulty: 3, estimatedMinutes: 160 },
            { id: "arq-8", subjectId: "arq", name: "UCP: ALU y unidad de control", description: "Operaciones aritméticas/lógicas, secuenciador", difficulty: 4, estimatedMinutes: 180 },
            { id: "arq-9", subjectId: "arq", name: "Buses y sincronización", description: "Datos, direcciones, control, transferencias", difficulty: 3, estimatedMinutes: 120 },
            { id: "arq-10", subjectId: "arq", name: "Conjunto de instrucciones CISC/RISC", description: "Filosofías, modos de direccionamiento", difficulty: 3, estimatedMinutes: 160 },
            { id: "arq-11", subjectId: "arq", name: "Programación en ensamblador", description: "Instrucciones, directivas, procedimientos, ejercicios", difficulty: 4, estimatedMinutes: 240 },
            { id: "arq-12", subjectId: "arq", name: "Interrupciones y E/S", description: "Métodos, programada, interrupciones, DMA", difficulty: 3, estimatedMinutes: 140 },
          ],
        },
        {
          id: "sis",
          name: "Sistemas y Procesos de Negocio",
          code: "ISI-108",
          level: 1,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 5,
          description: "Organización empresarial, procesos de negocio y el rol de los sistemas de información.",
          category: "engineering" as SubjectCategory,
          difficulty: 2,
          studyHoursPerWeek: 5,
          keyConcepts: ["Sistemas de información", "Procesos de negocio", "Organización empresarial", "Modelado de procesos", "Gestión de proyectos"],
          prerequisites: [],
          bibliography: {
            official: [
              "Davenport, T. Process Innovation. Harvard Business School Press.",
              "Peppard, J. & Ward, J. Strategic Planning for Information Systems. Wiley.",
              "O'Brien, J. & Marakas, G. Introduction to Information Systems. 17ª edición. McGraw-Hill."
            ],
            complementary: [
              "Laudon, K. & Laudon, J. Management Information Systems. 16ª edición. Pearson.",
              "Valacich, J. & George, J. Modern Systems Analysis and Design. Pearson.",
              "BPMN Specification. Object Management Group."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre conceptos de organización, sistemas de información y modelado de procesos con BPMN.",
            practice: "Análisis de casos empresariales, modelado de procesos con BPMN y discusión de situaciones reales.",
            activities: [
              "Análisis de casos empresariales",
              "Modelado de procesos con BPMN",
              "Trabajos Prácticos de análisis de SI",
              "Presentaciones grupales",
              "Visitas a empresas"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final que integra conocimientos de organización, procesos y SI.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos y presentaciones (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender la estructura organizacional y los procesos de negocio.",
            "Analizar el rol de los sistemas de información en la gestión empresarial.",
            "Modelar procesos de negocio con BPMN.",
            "Evaluar indicadores de gestión y herramientas de toma de decisiones."
          ],
          competencies: [
            "Analizar la estructura y procesos de una organización.",
            "Modelar procesos de negocio usando BPMN.",
            "Identificar el rol de los sistemas de información.",
            "Aplicar indicadores de gestión (KPIs).",
            "Comprender el ciclo de vida de los SI."
          ],
          partialExamples: [
            {
              topic: "Procesos de negocio",
              question: "Modelar con BPMN el proceso de venta de una empresa de software.",
              difficulty: 2,
              solution: "Solicitud → Evaluación → Cotización → Aprobación → Contrato → Entrega → Facturación."
            },
            {
              topic: "Sistemas de información",
              question: "Diferencia entre ERP, CRM y SCM.",
              difficulty: 2,
              solution: "ERP: procesos internos. CRM: clientes. SCM: cadena de suministro. Se integran con middlewares/APIs."
            }
          ],
          topics: [
            { id: "sis-1", subjectId: "sis", name: "Organización empresarial", description: "Tipos de empresas, estructura, áreas funcionales", difficulty: 1, estimatedMinutes: 120 },
            { id: "sis-2", subjectId: "sis", name: "Concepto de sistema de información", description: "Definición, tipos, roles en la organización", difficulty: 1, estimatedMinutes: 120 },
            { id: "sis-3", subjectId: "sis", name: "Procesos de negocio", description: "Definición, clasificación, indicadores, cadena de valor", difficulty: 2, estimatedMinutes: 140 },
            { id: "sis-4", subjectId: "sis", name: "Ciclo de vida de los SI", description: "Fases, metodologías de desarrollo", difficulty: 2, estimatedMinutes: 140 },
            { id: "sis-5", subjectId: "sis", name: "Rol del ingeniero en SI", description: "Funciones, responsabilidades, código de ética", difficulty: 1, estimatedMinutes: 80 },
            { id: "sis-6", subjectId: "sis", name: "Tecnología de información", description: "Infraestructura TI, tendencias, cloud, movilidad", difficulty: 2, estimatedMinutes: 120 },
            { id: "sis-7", subjectId: "sis", name: "Gestión de proyectos", description: "Fases, roles, planificación, seguimiento", difficulty: 2, estimatedMinutes: 140 },
            { id: "sis-8", subjectId: "sis", name: "Modelado con BPMN", description: "Elementos, diagramas, eventos, actividades, flujos", difficulty: 2, estimatedMinutes: 180 },
            { id: "sis-9", subjectId: "sis", name: "Indicadores de gestión", description: "KPIs, dashboards, balanced scorecard", difficulty: 2, estimatedMinutes: 120 },
          ],
        },
      ],
    },
    {
      level: 2,
      name: "Segundo Año",
      totalHours: 768,
      weeklyHours: 32,
      maxRecoveryNote: 60,
      subjects: [
        {
          id: "am2",
          name: "Análisis Matemático II",
          code: "ISI-201",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 5,
          hoursPerWeek: 5,
          totalHours: 120,
          recoveryNote: 10,
          description: "Funciones de varias variables y ecuaciones diferenciales ordinarias.",
          category: "math" as SubjectCategory,
          difficulty: 5,
          studyHoursPerWeek: 12,
          keyConcepts: ["Cálculo vectorial", "Derivadas parciales", "Integrales múltiples", "EDO", "Sistemas de ecuaciones diferenciales", "Modelado matemático"],
          prerequisites: ["am1"],
          bibliography: {
            official: [
              "Stewart, J. Calculo Multivariable. 8a edicion. Pearson.",
              "Burden, R. & Faires, J. Analisis Numerico. 10a edicion. Cengage.",
              "Boyce, W. & DiPrima, R. Elementary Differential Equations. 11a edicion. Wiley."
            ],
            complementary: [
              "Leithold, L. Calculo Multivariable. Harla.",
              "Zill, D. Ecuaciones Diferenciales. McGraw-Hill.",
              "Barcena, S. Guia de Ejercicios de AM II. EUA-UTN."
            ]
          },
          methodology: {
            theory: "Clase teorica magistral con calculo vectorial, derivadas parciales, integrales multiples y ecuaciones diferenciales ordinarias.",
            practice: "Clase practica con ejercicios de calculo multivariable, resolucion de EDO y modelado matematico.",
            activities: [
              "Resolucion de ejercicios de calculo vectorial",
              "Trabajos Practicos de EDO",
              "Modelado matematico de problemas fisicos",
              "Guias de ejercicios progresivos",
              "Simulacros de parcial"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final escrito con ejercicios de calculo multivariable y EDO.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Dominar el calculo de funciones de varias variables.",
            "Resolver ecuaciones diferenciales lineales de primer y segundo orden.",
            "Aplicar los teoremas de Green, Stokes y Gauss.",
            "Analizar sistemas de ecuaciones diferenciales.",
            "Resolver series de Fourier y ecuaciones en derivadas parciales."
          ],
          competencies: [
            "Calcular derivadas parciales, direccionales y el gradiente.",
            "Resolver integrales multiples y de linea.",
            "Resolver EDO lineales y no lineales.",
            "Analizar la estabilidad de puntos de equilibrio.",
            "Aplicar series de Fourier a problemas de ingenieria."
          ],
          partialExamples: [
            {
              topic: "Derivadas parciales",
              question: "Calcular la derivada direccional de f(x,y)=x^2y+sin(xy) en (1,pi) con u=(3/5,4/5).",
              difficulty: 3,
              solution: "Grad f=(pi,0), D_u f = grad f . u = 3pi/5 ≈ 1.885."
            },
            {
              topic: "EDO segundo orden",
              question: "Resolver y''+4y'+3y=6e^(-x) con y(0)=1, y'(0)=0.",
              difficulty: 4,
              solution: "yh=C1*e^(-x)+C2*e^(-3x), yp=(6/5)*x*e^(-x). Con CI: C1=9/10, C2=1/10."
            }
          ],
          topics: [
            { id: "am2-1", subjectId: "am2", name: "Cálculo vectorial", description: "Campos, curvas parametrizadas, vectores tangente y normal", difficulty: 3, estimatedMinutes: 200 },
            { id: "am2-2", subjectId: "am2", name: "Límites dobles e iterados", description: "Límites en R², continuidad, iterados vs dobles", difficulty: 3, estimatedMinutes: 180 },
            { id: "am2-3", subjectId: "am2", name: "Derivadas parciales y direccionales", description: "Gradiente, derivada direccional, cadena multivariada", difficulty: 3, estimatedMinutes: 200 },
            { id: "am2-4", subjectId: "am2", name: "Diferencial de funciones multivariables", description: "Diferenciabilidad, Jacobiana, máximos y mínimos", difficulty: 4, estimatedMinutes: 200 },
            { id: "am2-5", subjectId: "am2", name: "Integrales múltiples y de línea", description: "Doble, triple, cambio de variable, coordenadas", difficulty: 4, estimatedMinutes: 280 },
            { id: "am2-6", subjectId: "am2", name: "Divergencia y rotor", description: "Operador nabla, gradiente, rotacional, divergencia", difficulty: 4, estimatedMinutes: 180 },
            { id: "am2-7", subjectId: "am2", name: "Teorema de Green", description: "Green, Stokes, Gauss, aplicaciones físicas", difficulty: 5, estimatedMinutes: 200 },
            { id: "am2-8", subjectId: "am2", name: "Ecuaciones diferenciales lineales", description: "EDO lineales 1er y 2do orden, coeficientes constantes", difficulty: 3, estimatedMinutes: 240 },
            { id: "am2-9", subjectId: "am2", name: "Ecuaciones de primer y segundo orden", description: "Separables, exactas, homogéneas, Bernoulli", difficulty: 3, estimatedMinutes: 220 },
            { id: "am2-10", subjectId: "am2", name: "Variación de parámetros", description: "Método para EDO no homogéneas", difficulty: 4, estimatedMinutes: 160 },
            { id: "am2-11", subjectId: "am2", name: "Sistemas de ecuaciones diferenciales", description: "Sistemas lineales, autovalores, diagonalización", difficulty: 4, estimatedMinutes: 240 },
            { id: "am2-12", subjectId: "am2", name: "Exponencial matricial", description: "Matriz exponencial, resolución de sistemas", difficulty: 5, estimatedMinutes: 200 },
            { id: "am2-13", subjectId: "am2", name: "Puntos de equilibrio y estabilidad", description: "Estabilidad, retratos de fase, linealización", difficulty: 4, estimatedMinutes: 200 },
            { id: "am2-14", subjectId: "am2", name: "Ecuaciones en derivadas parciales", description: "Calor, onda, Laplace, separación de variables", difficulty: 5, estimatedMinutes: 240 },
            { id: "am2-15", subjectId: "am2", name: "Series de Fourier", description: "Representación periódica, coeficientes, convergencia", difficulty: 4, estimatedMinutes: 200 },
          ],
        },
        {
          id: "fis2",
          name: "Física II",
          code: "ISI-202",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 5,
          hoursPerWeek: 5,
          totalHours: 120,
          recoveryNote: 10,
          description: "Calor, electricidad, magnetismo, física de la onda y óptica física.",
          category: "physics" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 10,
          keyConcepts: ["Termodinámica", "Electricidad y magnetismo", "Electromagnetismo", "Óptica"],
          prerequisites: ["fis1"],
          bibliography: {
            official: [
              "Sears, F. & Zemansky, M. Fisica Universitaria. 15a edicion. Pearson.",
              "Halliday, D. et al. Fundamentos de Fisica. 11a edicion. Wiley.",
              "Tippens, P. Fisica: Conceptos y Aplicaciones. McGraw-Hill."
            ],
            complementary: [
              "Young, H. & Freedman, R. Fisica Universitaria. Pearson.",
              "Serway, R. Fisica para Ciencias e Ingenieria. McGraw-Hill."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre electricidad, magnetismo, optica y fenomenos ondulatorios.",
            practice: "Laboratorio de fisica: experimentos de electricidad, optica y ondas.",
            activities: [
              "Resolucion de problemas de electricidad y magnetismo",
              "Trabajos de laboratorio de optica",
              "Guias de ejercicios",
              "Experimentos de circuitos",
              "Simulaciones de fenomenos electromagneticos"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final escrito con ejercicios de electricidad, magnetismo y optica.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos y laboratorio (20%)",
              "Examen final escrito (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los principios del campo electrostatico y magnetostatico.",
            "Analizar circuitos electricos con corriente continua y alterna.",
            "Estudiar los fenomenos ondulatorios y opticos.",
            "Resolver problemas de electromagnetismo aplicando las ecuaciones de Maxwell."
          ],
          competencies: [
            "Calcular campos electricos y magneticos.",
            "Analizar circuitos de corriente continua y alterna.",
            "Resolver problemas de optica geometrica y fisica.",
            "Aplicar las leyes de Maxwell a fenomenos electromagneticos."
          ],
          partialExamples: [
            {
              topic: "Circuitos electricos",
              question: "Calcular la corriente en un circuito RLC serie con R=10ohm, L=0.1H, C=100uF y V=100V a 60Hz.",
              difficulty: 3,
              solution: "XL=37.7ohm, XC=26.5ohm, Z=sqrt(100+130.6)=15.2ohm, I=V/Z≈6.6A."
            },
            {
              topic: "Optica",
              question: "Un rayo de luz incide a 45 grados sobre un vidrio (n=1.5). Calcular angulo de refraccion.",
              difficulty: 2,
              solution: "Ley de Snell: 1*sin(45)=1.5*sin(r), r=arcsin(0.471)=28.1 grados."
            }
          ],
          topics: [
            { id: "fis2-1", subjectId: "fis2", name: "Termodinámica", description: "Sistemas, variables de estado, primer principio", difficulty: 3, estimatedMinutes: 200 },
            { id: "fis2-2", subjectId: "fis2", name: "Leyes de la termodinámica", description: "Primera y segunda ley, entropía, Carnot", difficulty: 3, estimatedMinutes: 220 },
            { id: "fis2-3", subjectId: "fis2", name: "Calor y energía interna", description: "Capacidad calorífica, conducción, convección, radiación", difficulty: 3, estimatedMinutes: 180 },
            { id: "fis2-4", subjectId: "fis2", name: "Mecánica de fluidos", description: "Presión, Bernoulli, viscosidad, flujo laminar/turbulento", difficulty: 3, estimatedMinutes: 180 },
            { id: "fis2-5", subjectId: "fis2", name: "Electricidad: cargas y campos", description: "Coulomb, campo eléctrico, Gauss, potencial, capacidad", difficulty: 3, estimatedMinutes: 220 },
            { id: "fis2-6", subjectId: "fis2", name: "Corriente eléctrica y circuitos", description: "Corriente, Ohm, serie-paralelo, Kirchhoff", difficulty: 3, estimatedMinutes: 200 },
            { id: "fis2-7", subjectId: "fis2", name: "Magnetismo", description: "Fuerza magnética, Biot-Savart, Ampère, materiales", difficulty: 4, estimatedMinutes: 200 },
            { id: "fis2-8", subjectId: "fis2", name: "Inducción electromagnética", description: "Faraday, inductancia, auto/mutua inducción", difficulty: 4, estimatedMinutes: 200 },
            { id: "fis2-9", subjectId: "fis2", name: "Circuitos de corriente alterna", description: "Impedancia, resonancia, filtros, transformadores", difficulty: 4, estimatedMinutes: 220 },
            { id: "fis2-10", subjectId: "fis2", name: "Ondas electromagnéticas", description: "Maxwell, ondas EM, espectro, polarización", difficulty: 4, estimatedMinutes: 180 },
            { id: "fis2-11", subjectId: "fis2", name: "Óptica física", description: "Interferencia, difracción, polarización, instrumentos", difficulty: 4, estimatedMinutes: 200 },
          ],
        },
        {
          id: "iys",
          name: "Ingeniería y Sociedad",
          code: "ISI-203",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 2,
          hoursPerWeek: 2,
          totalHours: 48,
          recoveryNote: 3,
          description: "Impacto social de la ingeniería, ética profesional y responsabilidad social.",
          category: "general" as SubjectCategory,
          difficulty: 1,
          studyHoursPerWeek: 3,
          keyConcepts: ["Ética profesional", "Responsabilidad social", "Desarrollo sustentable", "Propiedad intelectual"],
          prerequisites: [],
          bibliography: {
            official: [
              "Manacorda, M. Ingeniería y Sociedad. EUA-UTN.",
              "Freire, P. Pedagogía del Oprimido. Siglo XXI.",
              "Jara, O. La Educación en los Trabajadores. Ediciones HIMEMT."
            ],
            complementary: [
              "Freire, P. Pedagogía de la Esperanza. Siglo XXI.",
              "Sousa, S. Pedagogía del Oprimido. CIDEC.",
              "Duskel, L. Educación Popular: Un Camino para la Participación. AGEIA."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre relación ciencia-tecnología-sociedad, responsabilidad social del ingeniero.",
            practice: "Debates, análisis de casos de impacto social y presentaciones.",
            activities: [
              "Debates sobre ética e ingeniería",
              "Análisis de casos de impacto social",
              "Presentaciones de grupos",
              "Trabajo de campo",
              "Reflexión sobre responsabilidad profesional"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final y/o trabajo integrador final.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos y participación (20%)",
              "Examen final o trabajo integrador (100% de la nota final)"
            ]
          },
          objectives: [
            "Analizar la relación entre ciencia, tecnología y sociedad.",
            "Comprender la responsabilidad social y ética del ingeniero.",
            "Promover la participación ciudadana en la gestión tecnológica.",
            "Evaluar el impacto de las tecnologías en la sociedad."
          ],
          competencies: [
            "Analizar el impacto social de las tecnologías.",
            "Argumentar sobre dilemas éticos de la ingeniería.",
            "Promover la responsabilidad social en la práctica profesional.",
            "Evaluar proyectos tecnológicos desde una perspectiva social."
          ],
          partialExamples: [
            {
              topic: "Impacto social",
              question: "Analizar el impacto de la automatización en el empleo industrial.",
              difficulty: 2,
              solution: "Pérdida de empleos repetitivos, creación de nuevos roles técnicos, necesidad de reentrenamiento."
            },
            {
              topic: "Ética profesional",
              question: "Un ingeniero descubre un bug de seguridad en un software de su empresa. ¿Qué debe hacer?",
              difficulty: 3,
              solution: "Reportar internamente según protocolo, documentar, proponer corrección, escalar si no se atiende."
            }
          ],
          topics: [
            { id: "iys-1", subjectId: "iys", name: "Historia de la ingeniería", description: "Evolución, hitos, impacto social", difficulty: 1, estimatedMinutes: 80 },
            { id: "iys-2", subjectId: "iys", name: "Ética profesional", description: "Códigos de ética, dilemas, responsabilidad", difficulty: 1, estimatedMinutes: 100 },
            { id: "iys-3", subjectId: "iys", name: "Responsabilidad social", description: "Impacto social, inclusión digital, brecha tecnológica", difficulty: 1, estimatedMinutes: 80 },
            { id: "iys-4", subjectId: "iys", name: "Impacto ambiental", description: "Huella de carbono, sustentabilidad, residuos electrónicos", difficulty: 1, estimatedMinutes: 80 },
            { id: "iys-5", subjectId: "iys", name: "Propiedad intelectual", description: "Patentes, derechos de autor, software libre, licencias", difficulty: 2, estimatedMinutes: 100 },
            { id: "iys-6", subjectId: "iys", name: "Normas de calidad", description: "ISO 9001, ISO 27001, estándares", difficulty: 2, estimatedMinutes: 100 },
            { id: "iys-7", subjectId: "iys", name: "Legislación", description: "Marco legal, contratos, regulaciones", difficulty: 2, estimatedMinutes: 100 },
            { id: "iys-8", subjectId: "iys", name: "Innovación tecnológica", description: "Transferencia tecnológica, emprendimiento", difficulty: 1, estimatedMinutes: 80 },
          ],
        },
        {
          id: "eng2",
          name: "Inglés II",
          code: "ISI-204",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 2,
          hoursPerWeek: 2,
          totalHours: 48,
          recoveryNote: 3,
          description: "Profundizar competencias comunicativas en inglés con énfasis en textos técnicos.",
          category: "general" as SubjectCategory,
          difficulty: 2,
          studyHoursPerWeek: 4,
          keyConcepts: ["Gramática intermedia-avanzada", "Lectura técnica", "Escritura técnica", "Comunicación oral"],
          prerequisites: ["eng1"],
          bibliography: {
            official: [
              "Richards, J. & Hull, J. Interchange 2. Cambridge University Press.",
              "Folse, K. & Grabe, W. Technical English 2. National Geographic Learning.",
              "Carr, J. English for Computing. Pearson."
            ],
            complementary: [
              "Swan, M. Practical English Usage. Oxford University Press.",
              "Murphy, R. English Grammar in Use. Cambridge University Press.",
              "Hewings, M. Advanced Grammar in Use. Cambridge University Press."
            ]
          },
          methodology: {
            theory: "Clase centrada en gramática avanzada y vocabulario técnico especializado.",
            practice: "Presentaciones, escritura de documentación técnica, comprensión de conferencias.",
            activities: [
              "Análisis de documentación técnica en inglés",
              "Escritura de reportes y documentación de software",
              "Comprensión de conferencias técnicas",
              "Presentaciones orales sobre temas de tecnología",
              "Debates técnicos en inglés"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito y oral con énfasis en comprensión y producción técnica.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos de escritura y presentaciones (20%)",
              "Examen final escrito y oral (100% de la nota final)"
            ]
          },
          objectives: [
            "Desarrollar habilidades avanzadas de lectura técnica en inglés.",
            "Redactar documentación técnica y especificaciones de software.",
            "Comprender conferencias y presentaciones técnicas en inglés.",
            "Utilizar vocabulario técnico avanzado de ingeniería de software."
          ],
          competencies: [
            "Leer documentación técnica avanzada en inglés.",
            "Redactar especificaciones y reportes técnicos en inglés.",
            "Participar de reuniones técnicas en inglés.",
            "Traducir conceptos técnicos entre español e inglés."
          ],
          partialExamples: [
            {
              topic: "Documentación técnica",
              question: "Write API documentation for a REST endpoint that manages user accounts.",
              difficulty: 3,
              solution: "Include endpoint description, HTTP method, parameters, request/response examples, error codes, authentication."
            },
            {
              topic: "Comprensión técnica",
              question: "Read and summarize a technical paper about microservices architecture.",
              difficulty: 3,
              solution: "Identify problem, proposed solution, architecture, results, and conclusions."
            }
          ],
          topics: [
            { id: "eng2-1", subjectId: "eng2", name: "Gramática intermedia y avanzada", description: "Tiempos perfectos, condicionales, voz pasiva", difficulty: 2, estimatedMinutes: 140 },
            { id: "eng2-2", subjectId: "eng2", name: "Lectura crítica de artículos técnicos", description: "Papers, documentación técnica", difficulty: 3, estimatedMinutes: 140 },
            { id: "eng2-3", subjectId: "eng2", name: "Escritura técnica", description: "Reportes, documentación de software", difficulty: 3, estimatedMinutes: 140 },
            { id: "eng2-4", subjectId: "eng2", name: "Comprensión auditiva", description: "Conferencias, podcasts técnicos", difficulty: 2, estimatedMinutes: 100 },
            { id: "eng2-5", subjectId: "eng2", name: "Vocabulario avanzado", description: "Especializado, idiomático, académico", difficulty: 2, estimatedMinutes: 100 },
            { id: "eng2-6", subjectId: "eng2", name: "Presentaciones orales", description: "Exposiciones técnicas en inglés", difficulty: 3, estimatedMinutes: 120 },
          ],
        },
        {
          id: "spy",
          name: "Sintaxis y Semántica de los Lenguajes",
          code: "ISI-205",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Lenguajes formales y autómatas. Gramáticas, autómatas y proceso de compilación.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 8,
          keyConcepts: ["Teoría de lenguajes formales", "Autómatas", "Gramáticas", "Compilación", "Jerarquía de Chomsky"],
          prerequisites: ["led", "aed"],
          bibliography: {
            official: [
              "Sebesta, R. Concepts of Programming Languages. 12ª edición. Pearson.",
              "Tucker, A. & Noonan, R. Programming Languages: Principles and Paradigms. McGraw-Hill.",
              "Lewis, B. Concepts of Programming Languages. Pearson."
            ],
            complementary: [
              "Louden, K. Programming Languages: Principles and Practice. Cengage.",
              "Scott, M. Programming Language Pragmatics. Morgan Kaufmann."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre paradigmas de programación, semántica, tipos de datos y comparación de lenguajes.",
            practice: "Laboratorio de programación en múltiples paradigmas: imperativo, orientado a objetos, funcional, lógico.",
            activities: [
              "Implementación en Haskell (funcional)",
              "Implementación en Prolog (lógico)",
              "Implementación en Python/Java (OOP)",
              "Comparación de paradigmas",
              "Trabajos Prácticos de programación"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito y práctico de programación en múltiples paradigmas.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos de programación (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comparar y contrastar paradigmas de programación.",
            "Implementar soluciones usando programación funcional.",
            "Implementar soluciones usando programación lógica.",
            "Comprender los fundamentos teóricos de los lenguajes de programación."
          ],
          competencies: [
            "Programar en al menos tres paradigmas distintos.",
            "Analizar ventajas y desventajas de cada paradigma.",
            "Implementar algoritmos funcionales y lógicos.",
            "Comparar lenguajes de programación según sus características."
          ],
          partialExamples: [
            {
              topic: "Programación funcional",
              question: "Implementar en Haskell una función que filtre números pares y los multiplique por 2.",
              difficulty: 3,
              solution: "f = map (*2) . filter even"
            },
            {
              topic: "Programación lógica",
              question: "Escribir en Prolog un programa que determine si un número es primo.",
              difficulty: 3,
              solution: "primo(N) :- N>1, forall(between(2,N-1,I), N mod I =\= 0)."
            }
          ],
          topics: [
            { id: "spy-1", subjectId: "spy", name: "Gramáticas y lenguajes formales", description: "Definición formal, derivaciones, árboles, ambigüedad", difficulty: 3, estimatedMinutes: 200 },
            { id: "spy-2", subjectId: "spy", name: "Jerarquía de Chomsky", description: "Regulares, libres de contexto, sensibles, enumerables", difficulty: 3, estimatedMinutes: 180 },
            { id: "spy-3", subjectId: "spy", name: "Autómatas finitos", description: "AFD, AFN, minimización, equivalencia, Pumping", difficulty: 3, estimatedMinutes: 240 },
            { id: "spy-4", subjectId: "spy", name: "Expresiones regulares", description: "Sintaxis, equivalencia AFN, aplicación (grep, lex)", difficulty: 3, estimatedMinutes: 180 },
            { id: "spy-5", subjectId: "spy", name: "Gramáticas independientes del contexto", description: "Formas normales, simplificación, parsing", difficulty: 4, estimatedMinutes: 200 },
            { id: "spy-6", subjectId: "spy", name: "Autómatas push-down", description: "AP determinista y no determinista, parsing LL/LR", difficulty: 4, estimatedMinutes: 240 },
            { id: "spy-7", subjectId: "spy", name: "Análisis sintáctico", description: "Descendente recursivo, LL(1), shift-reduce, LR(0)", difficulty: 4, estimatedMinutes: 260 },
            { id: "spy-8", subjectId: "spy", name: "Máquinas de Turing", description: "Definición, variantes, decidibilidad", difficulty: 5, estimatedMinutes: 200 },
            { id: "spy-9", subjectId: "spy", name: "Semántica de lenguajes", description: "Estática, tipado, ámbito, operacional", difficulty: 4, estimatedMinutes: 180 },
            { id: "spy-10", subjectId: "spy", name: "Análisis semántico", description: "Tabla de símbolos, verificación de tipos", difficulty: 4, estimatedMinutes: 180 },
            { id: "spy-11", subjectId: "spy", name: "Proceso de compilación", description: "Fases: léxico, sintáctico, semántico, optimización", difficulty: 3, estimatedMinutes: 200 },
          ],
        },
        {
          id: "par",
          name: "Paradigmas de Programación",
          code: "ISI-206",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Principales paradigmas de programación: imperativo, POO, funcional y lógico.",
          category: "cs" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 8,
          keyConcepts: ["Programación imperativa", "POO", "Programación funcional", "Programación lógica", "Patrones de diseño", "SOLID"],
          prerequisites: ["aed", "led"],
          bibliography: {
            official: [
              "Downey, A. Think Python. O'Reilly.",
              "Lutz, M. Learning Python. 5ª edición. O'Reilly.",
              "Flanagan, D. JavaScript: The Definitive Guide. 7ª edición. O'Reilly."
            ],
            complementary: [
              "Deitel, P. Java: How to Program. 11ª edición. Pearson.",
              "Schildt, H. Java: The Complete Reference. McGraw-Hill.",
              "Gamma, E. Design Patterns. Addison-Wesley."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre conceptos de programación, tipos de datos, estructuras de control y diseño.",
            practice: "Laboratorio de programación con ejercicios prácticos en Python y Java.",
            activities: [
              "Ejercicios de programación en Python",
              "Implementación de clases en Java",
              "Trabajos Prácticos de diseño de clases",
              "Resolución de problemas algorítmicos",
              "Análisis de código y depuración"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito y práctico de programación.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos de programación (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Dominar los fundamentos de la programación imperativa.",
            "Comprender los principios de la programación orientada a objetos.",
            "Implementar programas con estructuras de datos básicas.",
            "Aplicar diseño de clases y patrones simples."
          ],
          competencies: [
            "Programar en Python y Java con fluidez.",
            "Diseñar clases y objetos con encapsulamiento.",
            "Implementar estructuras de datos básicas.",
            "Resolver problemas con programación orientada a objetos."
          ],
          partialExamples: [
            {
              topic: "POO",
              question: "Diseñar una clase CuentaBancaria con métodos depositar, extraer y consultar saldo.",
              difficulty: 2,
              solution: "Clase con atributo privado saldo, constructor, métodos con validación de saldo para extraer."
            },
            {
              topic: "Estructuras de datos",
              question: "Implementar una pila (stack) en Python usando listas.",
              difficulty: 2,
              solution: "class Stack: def __init__(self): self.items=[]; def push(self,item): self.items.append(item); def pop(self): return self.items.pop()"
            }
          ],
          topics: [
            { id: "par-1", subjectId: "par", name: "Conceptos de programación", description: "Paradigmas, abstracción, lenguajes representativos", difficulty: 1, estimatedMinutes: 120 },
            { id: "par-2", subjectId: "par", name: "Programación imperativa", description: "Estructuras de control, modularidad, parámetros", difficulty: 2, estimatedMinutes: 140 },
            { id: "par-3", subjectId: "par", name: "Programación estructurada y modular", description: "Secuencial, selección, iteración, módulos, alcance", difficulty: 2, estimatedMinutes: 140 },
            { id: "par-4", subjectId: "par", name: "POO: clases, herencia, polimorfismo", description: "Encapsulamiento, herencia, polimorfismo, interfaces", difficulty: 3, estimatedMinutes: 280 },
            { id: "par-5", subjectId: "par", name: "Principios SOLID", description: "SRP, OCP, LSP, ISP, DIP, acoplamiento, cohesión", difficulty: 3, estimatedMinutes: 200 },
            { id: "par-6", subjectId: "par", name: "Programación funcional", description: "Funciones puras, higher-order, inmutabilidad, Haskell", difficulty: 4, estimatedMinutes: 260 },
            { id: "par-7", subjectId: "par", name: "Programación lógica", description: "Prolog, hechos, reglas, backtracking, unificación", difficulty: 4, estimatedMinutes: 200 },
            { id: "par-8", subjectId: "par", name: "Comparación de paradigmas", description: "Ventajas, desventajas, multi-paradigma", difficulty: 3, estimatedMinutes: 120 },
            { id: "par-9", subjectId: "par", name: "Lenguajes representativos", description: "C, Java, Python, Haskell, Prolog, Lisp, Scala", difficulty: 2, estimatedMinutes: 140 },
          ],
        },
        {
          id: "so",
          name: "Sistemas Operativos",
          code: "ISI-207",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Estructura, funcionamiento y administración de sistemas operativos.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 8,
          keyConcepts: ["Gestión de procesos", "Planificación de CPU", "Gestión de memoria", "Sistemas de archivos", "Concurrencia", "Virtualización"],
          prerequisites: ["aed", "arq"],
          bibliography: {
            official: [
              "Silberschatz, A. Operating System Concepts. 10ª edición. Wiley.",
              "Tanenbaum, A. Modern Operating Systems. 4ª edición. Pearson.",
              "Stallings, W. Operating Systems: Internals and Design Principles. 9ª edición. Pearson."
            ],
            complementary: [
              "Love, R. Linux Kernel Development. Addison-Wesley.",
              "Arpaci-Dusseau, R. Operating Systems: Three Easy Things. Arpaci-Dusseau Books."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre gestión de procesos, memoria, archivos y seguridad en sistemas operativos.",
            practice: "Laboratorio con comandos Linux, programación de procesos, y simulación de algoritmos de planificación.",
            activities: [
              "Ejercicios de comandos Linux/Unix",
              "Programación de procesos (fork, pipe, signal)",
              "Simulación de algoritmos de planificación",
              "Trabajos Prácticos de gestión de memoria",
              "Análisis de sistemas operativos"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito con ejercicios de gestión de procesos, memoria y archivos.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender la arquitectura general de un sistema operativo.",
            "Analizar algoritmos de planificación de procesos.",
            "Gestionar memoria virtual y sistemas de archivos.",
            "Implementar programación de procesos y concurrencia."
          ],
          competencies: [
            "Gestionar procesos y hilos en un sistema operativo.",
            "Implementar comunicación entre procesos (IPC).",
            "Analizar algoritmos de planificación y sincronización.",
            "Administrar sistemas de archivos y memoria."
          ],
          partialExamples: [
            {
              topic: "Planificación de procesos",
              question: "Comparar FCFS, SJF y Round Robin (quantum=2) con procesos: P1(6), P2(2), P3(8).",
              difficulty: 3,
              solution: "FCFS: promedio=16/3=5.3. SJF: P2,P1,P3, promedio=8.6/3=2.9. RR: ciclos alternados, promedio más alto que SJF."
            },
            {
              topic: "Programación de procesos",
              question: "Crear un programa en C que use fork() para generar 3 procesos hijos.",
              difficulty: 3,
              solution: "Loop 3 veces con fork(), verificar PID en cada rama, padres esperan con wait()."
            }
          ],
          topics: [
            { id: "so-1", subjectId: "so", name: "Estructura del SO", description: "Evolución, monolítica/micronúcleo, llamadas al sistema", difficulty: 2, estimatedMinutes: 160 },
            { id: "so-2", subjectId: "so", name: "Gestión de procesos", description: "Creación, estados, cola de procesos, PCB", difficulty: 3, estimatedMinutes: 200 },
            { id: "so-3", subjectId: "so", name: "Problemas clásicos de concurrencia", description: "Productor-consumidor, filósofos, lectores-escritores", difficulty: 4, estimatedMinutes: 220 },
            { id: "so-4", subjectId: "so", name: "Exclusión mutua", description: "Semáforos, monitores, mutex, interbloqueo", difficulty: 4, estimatedMinutes: 240 },
            { id: "so-5", subjectId: "so", name: "Gestión de memoria", description: "Particiones, paginación, segmentación, fragmentación", difficulty: 4, estimatedMinutes: 240 },
            { id: "so-6", subjectId: "so", name: "Memoria virtual", description: "Demand paging, FIFO, LRU, Clock, Working Set", difficulty: 4, estimatedMinutes: 240 },
            { id: "so-7", subjectId: "so", name: "Sistemas de archivos", description: "Asignación, directorios, FAT, ext4, NTFS", difficulty: 3, estimatedMinutes: 200 },
            { id: "so-8", subjectId: "so", name: "Planificación de CPU", description: "FCFS, SJF, RR, MLQ, MLFQ, tiempo real", difficulty: 3, estimatedMinutes: 220 },
            { id: "so-9", subjectId: "so", name: "Gestión de E/S", description: "Buffers, caches, spooling, scheduling de disco", difficulty: 3, estimatedMinutes: 160 },
            { id: "so-10", subjectId: "so", name: "Seguridad del SO", description: "Autenticación, control de acceso, hardening", difficulty: 3, estimatedMinutes: 160 },
            { id: "so-11", subjectId: "so", name: "Virtualización y contenedores", description: "Hypervisors, VMs, Docker, Kubernetes", difficulty: 3, estimatedMinutes: 180 },
          ],
        },
        {
          id: "asi",
          name: "Análisis de Sistemas de Información - Integradora",
          code: "ISI-208",
          level: 2,
          career: "Ingeniería en Sistemas de Información",
          credits: 6,
          hoursPerWeek: 6,
          totalHours: 144,
          recoveryNote: 10,
          description: "Metodologías, modelos, técnicas de análisis de SI. Ingeniería de requerimientos.",
          category: "engineering" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 12,
          keyConcepts: ["Metodologías de análisis", "Ingeniería de requerimientos", "Modelado de SI", "UML", "Documentación"],
          prerequisites: ["spy", "sis"],
          bibliography: {
            official: [
              "Tanenbaum, A. & Bos, H. Modern Operating Systems. 4ª edición. Pearson.",
              "Nurmi, D. Cloud Computing. VDM Verlag.",
              "Armbrust, M. et al. Above the Clouds: A Berkeley View of Cloud Computing. UC Berkeley."
            ],
            complementary: [
              "Erl, T. Cloud Computing: Concepts, Technology and Architecture. Prentice Hall.",
              "Kavis, M. Architecting the Cloud. Wiley."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre servicios en la nube, virtualización, arquitecturas de software e infraestructura.",
            practice: "Laboratorio con servicios AWS/GCP, configuración de contenedores Docker, despliegue en la nube.",
            activities: [
              "Configuración de máquinas virtuales en la nube",
              "Implementación de servicios cloud (SaaS, PaaS, IaaS)",
              "Trabajos Prácticos de virtualización",
              "Despliegue con Docker y Kubernetes",
              "Evaluación de proveedores cloud"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito con ejercicios de servicios en la nube.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los modelos de servicio cloud (IaaS, PaaS, SaaS).",
            "Implementar servicios en la nube utilizando AWS o GCP.",
            "Diseñar arquitecturas escalables y resilientes en la nube.",
            "Evaluar ventajas y desventajas del cloud computing."
          ],
          competencies: [
            "Desplegar aplicaciones en plataformas cloud.",
            "Configurar servicios de almacenamiento y computación en la nube.",
            "Diseñar arquitecturas cloud con alta disponibilidad.",
            "Evaluar costos y rendimiento de servicios cloud."
          ],
          partialExamples: [
            {
              topic: "Servicios cloud",
              question: "Comparar AWS EC2, Google Compute Engine y Azure Virtual Machines.",
              difficulty: 2,
              solution: "Comparar precio, rendimiento, disponibilidad regional, herramientas CLI, integración con otros servicios."
            },
            {
              topic: "Contenedores",
              question: "Crear un Dockerfile para desplegar una aplicación Node.js.",
              difficulty: 3,
              solution: "FROM node:18-alpine, WORKDIR /app, COPY package*.json, RUN npm ci, COPY ., EXPOSE 3000, CMD node server.js."
            }
          ],
          topics: [
            { id: "asi-1", subjectId: "asi", name: "Procesos de desarrollo de SI", description: "Ciclo de vida, waterfall, iterativo, ágil", difficulty: 2, estimatedMinutes: 160 },
            { id: "asi-2", subjectId: "asi", name: "Metodologías de análisis", description: "SSADM, Merise, ágiles para análisis", difficulty: 3, estimatedMinutes: 180 },
            { id: "asi-3", subjectId: "asi", name: "Técnicas de relevamiento", description: "Entrevistas, cuestionarios, observación, JAD", difficulty: 2, estimatedMinutes: 140 },
            { id: "asi-4", subjectId: "asi", name: "Requerimientos: identificación y validación", description: "Funcionales y no funcionales, trazabilidad", difficulty: 3, estimatedMinutes: 200 },
            { id: "asi-5", subjectId: "asi", name: "Patrones de análisis", description: "GoF, enterprise patterns", difficulty: 4, estimatedMinutes: 180 },
            { id: "asi-6", subjectId: "asi", name: "Estudio de prefactibilidad", description: "Costo-beneficio, viabilidad técnica, económica", difficulty: 3, estimatedMinutes: 140 },
            { id: "asi-7", subjectId: "asi", name: "Modelado de negocios", description: "Contexto, DFD, diccionario de datos", difficulty: 3, estimatedMinutes: 200 },
            { id: "asi-8", subjectId: "asi", name: "Documentación de análisis", description: "Especificación, modelo a implementar", difficulty: 2, estimatedMinutes: 140 },
            { id: "asi-9", subjectId: "asi", name: "UML para análisis", description: "Casos de uso, clases, secuencia, actividad, estados", difficulty: 3, estimatedMinutes: 240 },
            { id: "asi-10", subjectId: "asi", name: "Ingeniería de requerimientos", description: "Elicitación, validación, historias de usuario", difficulty: 3, estimatedMinutes: 200 },
          ],
        },
      ],
    },
    {
      level: 3,
      name: "Tercer Año",
      totalHours: 744,
      weeklyHours: 31,
      maxRecoveryNote: 60,
      subjects: [
        {
          id: "peyest",
          name: "Probabilidad y Estadística",
          code: "ISI-301",
          level: 3,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Herramientas matemáticas para análisis de incertidumbre y toma de decisiones.",
          category: "math" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 6,
          keyConcepts: ["Probabilidad y distribuciones", "Variable aleatoria", "Inferencia estadística", "Pruebas de hipótesis", "Regresión"],
          prerequisites: ["am2"],
          bibliography: {
            official: [
              "Project Management Institute. PMBOK Guide. 7ª edición. PMI.",
              "Kerzner, H. Project Management: A Systems Approach. Wiley.",
              "ISO 21500:2021. Guía sobre gestión de proyectos."
            ],
            complementary: [
              "Wysocki, R. Effective Project Management. Wiley.",
              "Meredith, J. Project Management: A Managerial Approach. Wiley."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre gestión de proyectos, planificación, estimación y control.",
            practice: "Simulación de proyectos, uso de herramientas de gestión (MS Project, GanttProject), trabajo en equipo.",
            activities: [
              "Elaboración de WBS y diagramas de Gantt",
              "Estimación de costos y plazos",
              "Gestión de riesgos en proyectos",
              "Trabajos Prácticos de planificación",
              "Presentaciones de proyectos"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final y/o presentación de proyecto integrador.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos y participación (20%)",
              "Examen final o proyecto integrador (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los procesos de gestión de proyectos según PMBOK.",
            "Aplicar técnicas de estimación de costos y duración.",
            "Elaborar planes de proyecto con WBS y cronogramas.",
            "Gestionar riesgos en proyectos de software."
          ],
          competencies: [
            "Elaborar un plan de proyecto completo.",
            "Estimar costos y duración de actividades.",
            "Gestionar riesgos y cambios en el alcance.",
            "Aplicar herramientas de gestión de proyectos."
          ],
          partialExamples: [
            {
              topic: "Estimación",
              question: "Estimar el esfuerzo para un proyecto de 50,000 LOC usando el modelo COCOMO.",
              difficulty: 3,
              solution: "Esfuerzo = a x (KLOC)^b x EAF. Para organización semi-separada: a=3.0, b=1.12, EAF=1.0, Esfuerzo ≈ 240 persona-meses."
            },
            {
              topic: "WBS",
              question: "Crear la estructura de desglose de trabajo (WBS) para un proyecto de e-commerce.",
              difficulty: 2,
              solution: "1. Planificación > 1.1 Requisitos, 1.2 Diseño. 2. Desarrollo > 2.1 Frontend, 2.2 Backend, 2.3 BD. 3. Testing > 3.1 Unitarias, 3.2 Integración. 4. Despliegue."
            }
          ],
          topics: [
            { id: "peyest-1", subjectId: "peyest", name: "Teoría de la probabilidad", description: "Espacios muestrales, eventos, axiomas", difficulty: 2, estimatedMinutes: 180 },
            { id: "peyest-2", subjectId: "peyest", name: "Probabilidad condicional", description: "Definición, Bayes, independencia", difficulty: 3, estimatedMinutes: 180 },
            { id: "peyest-3", subjectId: "peyest", name: "Variable aleatoria", description: "Discretas, continuas, distribución, esperanza, varianza", difficulty: 3, estimatedMinutes: 220 },
            { id: "peyest-4", subjectId: "peyest", name: "Distribuciones de probabilidad", description: "Bernoulli, binomial, Poisson, normal, exponencial", difficulty: 3, estimatedMinutes: 260 },
            { id: "peyest-5", subjectId: "peyest", name: "Distribución muestral", description: "Media muestral, CLE", difficulty: 4, estimatedMinutes: 180 },
            { id: "peyest-6", subjectId: "peyest", name: "Estadística descriptiva", description: "Tendencia central, dispersión, gráficos", difficulty: 2, estimatedMinutes: 140 },
            { id: "peyest-7", subjectId: "peyest", name: "Inferencia estadística", description: "Estimación, intervalos de confianza", difficulty: 4, estimatedMinutes: 220 },
            { id: "peyest-8", subjectId: "peyest", name: "Pruebas de hipótesis", description: "H0/H1, significancia, p-value, errores I y II", difficulty: 4, estimatedMinutes: 220 },
            { id: "peyest-9", subjectId: "peyest", name: "Regresión lineal", description: "Mínimos cuadrados, R², residuos", difficulty: 3, estimatedMinutes: 200 },
            { id: "peyest-10", subjectId: "peyest", name: "Regresión múltiple", description: "Multivariado, selección de variables, predicción", difficulty: 4, estimatedMinutes: 200 },
          ],
        },
        {
          id: "eco",
          name: "Economía",
          code: "ISI-302",
          level: 3,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Micro y macroeconomía aplicable a gestión de proyectos de ingeniería.",
          category: "general" as SubjectCategory,
          difficulty: 2,
          studyHoursPerWeek: 5,
          keyConcepts: ["Oferta y demanda", "Costos y producción", "Estructuras de mercado", "Macroeconomía", "Evaluación de proyectos"],
          prerequisites: [],
          bibliography: {
            official: [
              "Mankiw, N. Principles of Economics. 9ª edición. Cengage.",
              "Samuelson, P. Economics. 20ª edición. McGraw-Hill.",
              "Pindyck, R. & Rubinfeld, D. Microeconomics. 9ª edición. Pearson."
            ],
            complementary: [
              "Varian, H. Intermediate Microeconomics. 9ª edición. Norton.",
              "Romer, D. Advanced Macroeconomics. 5ª edición. McGraw-Hill."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre micro y macroeconomía aplicada a la ingeniería.",
            practice: "Análisis de casos económicos, resolución de problemas de evaluación de proyectos.",
            activities: [
              "Análisis de mercado y costos",
              "Evaluación económica de proyectos",
              "Trabajos Prácticos de ingeniería económica",
              "Estudio de casos",
              "Resolución de problemas de inversión"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final con ejercicios de evaluación de proyectos y microeconomía.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los principios de microeconomía y macroeconomía.",
            "Analizar costos, ingresos y estructuras de mercado.",
            "Evaluar la viabilidad económica de proyectos de ingeniería.",
            "Aplicar herramientas de ingeniería económica (VPN, TIR, B/C)."
          ],
          competencies: [
            "Analizar la oferta y demanda de bienes y servicios.",
            "Calcular indicadores de evaluación de proyectos (VPN, TIR, B/C).",
            "Evaluar la rentabilidad de inversiones.",
            "Tomar decisiones económicas fundamentadas."
          ],
          partialExamples: [
            {
              topic: "Evaluación de proyectos",
              question: "Un proyecto con inversión inicial de $1,000,000 genera $400,000 anuales durante 3 años. Tasa de descuento 10%. Calcular VPN y TIR.",
              difficulty: 3,
              solution: "VPN = -1,000,000 + 400,000/1.1 + 400,000/1.21 + 400,000/1.331 ≈ -$5,259. TIR ≈ 9.7%, menor que la tasa de descuento."
            },
            {
              topic: "Oferta y demanda",
              question: "Qd = 100 - 2P, Qs = -20 + 3P. Calcular equilibrio y excedente del consumidor.",
              difficulty: 2,
              solution: "Equilibrio: 100-2P = -20+3P, P*=24, Q*=52. Precio máximo: P=50 (Qd=0). Excedente = 1/2*(50-24)*52 = 676."
            }
          ],
          topics: [
            { id: "eco-1", subjectId: "eco", name: "Conceptos básicos", description: "Escasez, agentes económicos, mercado", difficulty: 1, estimatedMinutes: 100 },
            { id: "eco-2", subjectId: "eco", name: "Oferta y demanda", description: "Curvas, equilibrio, desplazamientos", difficulty: 2, estimatedMinutes: 140 },
            { id: "eco-3", subjectId: "eco", name: "Elasticidad", description: "Precio, cruzada, renta", difficulty: 3, estimatedMinutes: 140 },
            { id: "eco-4", subjectId: "eco", name: "Teoría del consumidor", description: "Utilidad, restricción, curvas de indiferencia", difficulty: 2, estimatedMinutes: 160 },
            { id: "eco-5", subjectId: "eco", name: "Teoría del productor", description: "Producción, costos, rendimientos a escala", difficulty: 2, estimatedMinutes: 180 },
            { id: "eco-6", subjectId: "eco", name: "Mercados", description: "Competencia perfecta, monopolio, oligopolio", difficulty: 2, estimatedMinutes: 180 },
            { id: "eco-7", subjectId: "eco", name: "Macroeconomía: PBI, inflación, desempleo", description: "Producto bruto, inflación, desempleo", difficulty: 2, estimatedMinutes: 160 },
            { id: "eco-8", subjectId: "eco", name: "Política monetaria y fiscal", description: "Banco central, impuestos, gasto público", difficulty: 2, estimatedMinutes: 140 },
            { id: "eco-9", subjectId: "eco", name: "Análisis económico-financiero", description: "VPN, TIR, payback, costo-beneficio", difficulty: 3, estimatedMinutes: 200 },
            { id: "eco-10", subjectId: "eco", name: "Economía digital", description: "Plataformas, efectos de red, bienes digitales", difficulty: 2, estimatedMinutes: 120 },
          ],
        },
        {
          id: "bd",
          name: "Bases de Datos",
          code: "ISI-303",
          level: 3,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Modelos de datos, diseño relacional, SQL y administración de bases de datos.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 8,
          keyConcepts: ["Modelo relacional", "Diseño de BD", "Normalización", "SQL", "Algebra relacional", "Transacciones"],
          prerequisites: ["asi"],
          bibliography: {
            official: [
              "Elmasri, R. & Navathe, S. Fundamentals of Database Systems. 7ª edición. Pearson.",
              "Connolly, T. & Begg, C. Database Systems: A Practical Approach. 6ª edición. Pearson.",
              "Ramakrishnan, R. & Gehrke, J. Database Management Systems. 3ª edición. McGraw-Hill."
            ],
            complementary: [
              "Date, C. An Introduction to Database Systems. 8ª edición. Pearson.",
              "Silberschatz, A. Database System Concepts. 7ª edición. McGraw-Hill."
            ]
          },
          methodology: {
            theory: "Clase teórica sobre modelos de datos, algebra relacional, normalización y transacciones.",
            practice: "Laboratorio con PostgreSQL: creación de BD, consultas SQL, procedimientos almacenados.",
            activities: [
              "Diseño de esquemas de BD (ER y relacional)",
              "Implementación de consultas SQL avanzadas",
              "Normalización hasta 3FN y BCNF",
              "Trabajos Prácticos de SQL",
              "Optimización de consultas"
            ]
          },
          evaluation: {
            regularity: "Aprobar como mínimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% mínimo).",
            promotion: "Examen final escrito y práctico de SQL.",
            recovery: "Recuperatorio en el primer semestre del año siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Prácticos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Diseñar bases de datos relacionales usando el modelo ER.",
            "Escribir consultas SQL complejas (JOINs, subconsultas, vistas).",
            "Normalizar bases de datos hasta la forma normal de Boyce-Codd.",
            "Gestionar transacciones y concurrencia."
          ],
          competencies: [
            "Diseñar esquemas de BD con el modelo entidad-relación.",
            "Escribir consultas SQL avanzadas.",
            "Aplicar técnicas de normalización.",
            "Gestionar transacciones con ACID."
          ],
          partialExamples: [
            {
              topic: "SQL avanzado",
              question: "Escribir una consulta que obtenga los 5 estudiantes con mayor promedio por materia.",
              difficulty: 3,
              solution: "SELECT s.name, m.name, AVG(n.grade) FROM students s JOIN grades n ON s.id=n.student_id JOIN subjects m ON n.subject_id=m.id GROUP BY s.id, m.id ORDER BY AVG(n.grade) DESC FETCH FIRST 5 ROWS ONLY."
            },
            {
              topic: "Normalización",
              question: "Normalizar a 3FN la tabla: Alumno(nombre, carrera, profesor, materia, aula).",
              difficulty: 4,
              solution: "Crear tablas: Alumno(id, nombre, carrera_id), Carrera(id, nombre), Profesor(id, nombre), Materia(id, nombre, profesor_id), Aula(id, numero), Clase(alumno_id, materia_id, aula_id)."
            }
          ],
          topics: [
            { id: "bd-1", subjectId: "bd", name: "Archivos vs bases de datos", description: "Limitaciones de archivos, ventajas de BD", difficulty: 1, estimatedMinutes: 100 },
            { id: "bd-2", subjectId: "bd", name: "DBMS", description: "Componentes, arquitectura, tipos", difficulty: 2, estimatedMinutes: 120 },
            { id: "bd-3", subjectId: "bd", name: "Arquitectura de BD", description: "Niveles, independencia de datos", difficulty: 2, estimatedMinutes: 140 },
            { id: "bd-4", subjectId: "bd", name: "Modelos de datos ER y relacional", description: "Entidad, relación, cardinalidad, transformación", difficulty: 3, estimatedMinutes: 220 },
            { id: "bd-5", subjectId: "bd", name: "Modelo relacional", description: "Esquema, dominios, claves, integridad", difficulty: 3, estimatedMinutes: 200 },
            { id: "bd-6", subjectId: "bd", name: "Algebra relacional", description: "Selección, proyección, join, unión, diferencia", difficulty: 3, estimatedMinutes: 180 },
            { id: "bd-7", subjectId: "bd", name: "Normalización (1FN-BCNF)", description: "Dependencias funcionales, 1FN a BCNF", difficulty: 4, estimatedMinutes: 280 },
            { id: "bd-8", subjectId: "bd", name: "SQL: DDL y DML", description: "CREATE, ALTER, INSERT, SELECT, JOINs", difficulty: 3, estimatedMinutes: 300 },
            { id: "bd-9", subjectId: "bd", name: "Subconsultas y vistas", description: "Subqueries, vistas, funciones, procedimientos", difficulty: 3, estimatedMinutes: 200 },
            { id: "bd-10", subjectId: "bd", name: "Integridad y transacciones", description: "ACID, concurrencia, bloqueo, aislamiento", difficulty: 4, estimatedMinutes: 220 },
            { id: "bd-11", subjectId: "bd", name: "Procedimientos almacenados", description: "Funciones, triggers, cursores", difficulty: 3, estimatedMinutes: 180 },
            { id: "bd-12", subjectId: "bd", name: "Seguridad", description: "Roles, permisos, encriptación", difficulty: 3, estimatedMinutes: 140 },
            { id: "bd-13", subjectId: "bd", name: "Indexación", description: "B-tree, hash, optimización de consultas", difficulty: 4, estimatedMinutes: 180 },
          ],
        },
        {
          id: "dsw",
          name: "Desarrollo de Software",
          code: "ISI-304",
          level: 3,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Diseño e implementación de software con metodologías ágiles y buenas prácticas.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 10,
          keyConcepts: ["Metodologías ágiles", "Diseño de software", "Arquitectura", "Control de versiones", "Pruebas", "Desarrollo full-stack"],
          prerequisites: ["spy", "par"],
          bibliography: {
            official: [
              "Sommerville, I. Software Engineering. 10a edicion. Pearson.",
              "Pressman, R. Software Engineering: A Practitioner's Approach. 9a edicion. McGraw-Hill.",
              "Boehm, B. Software Engineering Economics. Prentice-Hall."
            ],
            complementary: [
              "Beck, K. Extreme Programming Explained. Addison-Wesley.",
              "Martin, R. Clean Code. Prentice Hall.",
              "Fowler, M. Refactoring. 2a edicion. Addison-Wesley."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre ciclo de vida del software, metodos agiles y procesos de desarrollo.",
            practice: "Desarrollo de un proyecto de software en equipo usando metodologias agiles (Scrum).",
            activities: [
              "Gestion de un proyecto con Scrum",
              "Diseno de arquitectura de software",
              "Implementacion de un sistema de informacion",
              "Trabajos Practicos de diseno",
              "Revision de codigo y testing"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final escrito y/o presentacion del proyecto de software.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajo de proyecto (20%)",
              "Examen final o presentacion (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los modelos de ciclo de vida del software.",
            "Aplicar metodologias agiles (Scrum, Kanban).",
            "Disenar arquitecturas de software escalables.",
            "Implementar procesos de aseguramiento de calidad."
          ],
          competencies: [
            "Planificar y gestionar un proyecto de software.",
            "Disenar la arquitectura de un sistema de informacion.",
            "Aplicar principios SOLID y patrones de diseno.",
            "Implementar testing automatizado."
          ],
          partialExamples: [
            {
              topic: "Metodologias agiles",
              question: "Describir las fases de un sprint de Scrum de 2 semanas.",
              difficulty: 2,
              solution: "Sprint Planning (dia 1) -> Desarrollo (dias 1-10) -> Daily Standup (diario) -> Sprint Review (dia 10) -> Sprint Retrospective (dia 10)."
            },
            {
              topic: "Arquitectura",
              question: "Disenar la arquitectura de un sistema de e-commerce escalable.",
              difficulty: 3,
              solution: "Arquitectura de microservicios: Auth, Products, Orders, Payments, Notifications. API Gateway, Message Queue, Cache (Redis)."
            }
          ],
          topics: [
            { id: "dsw-1", subjectId: "dsw", name: "Metodologías ágiles: Scrum, Kanban", description: "Roles, eventos, artefactos, estimación", difficulty: 2, estimatedMinutes: 180 },
            { id: "dsw-2", subjectId: "dsw", name: "Análisis OO y diseño", description: "Modelado OO, UML, casos de uso", difficulty: 3, estimatedMinutes: 200 },
            { id: "dsw-3", subjectId: "dsw", name: "Patrones de diseño", description: "GoF, arquitectónicos", difficulty: 4, estimatedMinutes: 240 },
            { id: "dsw-4", subjectId: "dsw", name: "Arquitectura: capas, MVC, microservicios", description: "Patrones, limpia, hexagonal, microservicios", difficulty: 4, estimatedMinutes: 220 },
            { id: "dsw-5", subjectId: "dsw", name: "Control de versiones: Git", description: "Commits, branching, merging, PRs", difficulty: 2, estimatedMinutes: 140 },
            { id: "dsw-6", subjectId: "dsw", name: "Desarrollo web: front-end y back-end", description: "HTML/CSS/JS, React, frameworks backend, APIs", difficulty: 3, estimatedMinutes: 300 },
            { id: "dsw-7", subjectId: "dsw", name: "ORM", description: "Mapeo O-R, ActiveRecord, migraciones", difficulty: 3, estimatedMinutes: 180 },
            { id: "dsw-8", subjectId: "dsw", name: "Pruebas de software", description: "Unit, integration, e2e, TDD, BDD, mocking", difficulty: 3, estimatedMinutes: 200 },
            { id: "dsw-9", subjectId: "dsw", name: "Documentación técnica", description: "README, API docs, ADRs, wikis", difficulty: 2, estimatedMinutes: 100 },
            { id: "dsw-10", subjectId: "dsw", name: "CI/CD", description: "Integración/despliegue continuo, pipelines", difficulty: 4, estimatedMinutes: 200 },
            { id: "dsw-11", subjectId: "dsw", name: "Gestión de calidad", description: "Métricas, linters, code review, deuda técnica", difficulty: 3, estimatedMinutes: 140 },
          ],
        },
        {
          id: "cd",
          name: "Comunicación de Datos",
          code: "ISI-305",
          level: 3,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Fundamentos de telecomunicaciones: señales, transmisión, modulación, multiplexación y redes.",
          category: "cs" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 8,
          keyConcepts: ["Señales y transmisión", "Canales de comunicación", "Modulación", "Modelo OSI/TCP/IP", "Capacidad de canal"],
          prerequisites: ["fis2"],
          bibliography: {
            official: [
              "Norvig, P. & Russell, S. Artificial Intelligence: A Modern Approach. 4a edicion. Pearson.",
              "Russell, S. & Norvig, P. Artificial Intelligence. 3a edicion. Pearson.",
              "Poole, D. & Mackworth, A. Artificial Intelligence. 3a edicion. Oxford University Press."
            ],
            complementary: [
              "Bishop, C. Pattern Recognition and Machine Learning. Springer.",
              "Goodfellow, I. Deep Learning. MIT Press.",
              "Hastie, T. et al. The Elements of Statistical Learning. Springer."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre conceptos de IA, busqueda, representacion del conocimiento y aprendizaje automatico.",
            practice: "Laboratorio con implementacion de algoritmos de busqueda, arboles de decision y redes neuronales.",
            activities: [
              "Implementacion de algoritmos de busqueda",
              "Construccion de arboles de decision",
              "Entrenamiento de modelos de ML",
              "Trabajos Practicos de IA",
              "Analisis de datasets"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final escrito con ejercicios de IA y ML.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los fundamentos teoricos de la inteligencia artificial.",
            "Implementar algoritmos de busqueda y optimizacion.",
            "Entrenar y evaluar modelos de aprendizaje automatico.",
            "Aplicar tecnicas de IA a problemas de ingenieria."
          ],
          competencies: [
            "Implementar algoritmos de busqueda (A*, minimax).",
            "Construir clasificadores con arboles de decision y SVM.",
            "Evaluar modelos de ML con metricas apropiadas.",
            "Aplicar tecnicas de deep learning basicas."
          ],
          partialExamples: [
            {
              topic: "Busqueda",
              question: "Aplicar el algoritmo A* para encontrar el camino mas corto en un grafo con pesos.",
              difficulty: 3,
              solution: "Usar f(n) = g(n) + h(n), donde g es el costo real y h la heuristica. Expandir siempre el nodo con menor f."
            },
            {
              topic: "Machine Learning",
              question: "Entrenar un arbol de decision para clasificar emails como spam o no spam.",
              difficulty: 3,
              solution: "Features: frecuencia de palabras, presencia de enlaces, longitud del mensaje. Split por ganancia de informacion."
            }
          ],
          topics: [
            { id: "cd-1", subjectId: "cd", name: "Información y comunicaciones", description: "Definición de información, entropía, redundancia", difficulty: 2, estimatedMinutes: 120 },
            { id: "cd-2", subjectId: "cd", name: "Señales de transmisión", description: "Analógicas, digitales, espectro, Fourier", difficulty: 3, estimatedMinutes: 180 },
            { id: "cd-3", subjectId: "cd", name: "Ruido y distorsión", description: "Tipos de ruido, S/R, distorsión, atenuación", difficulty: 3, estimatedMinutes: 140 },
            { id: "cd-4", subjectId: "cd", name: "Análisis de espectro", description: "Fourier, densidad espectral, ancho de banda", difficulty: 4, estimatedMinutes: 160 },
            { id: "cd-5", subjectId: "cd", name: "Medidas en telecomunicaciones", description: "Niveles, dB, impedancia", difficulty: 2, estimatedMinutes: 120 },
            { id: "cd-6", subjectId: "cd", name: "Filtros", description: "Pasa-bajos, pasa-altos, Butterworth", difficulty: 3, estimatedMinutes: 160 },
            { id: "cd-7", subjectId: "cd", name: "Velocidad de transmisión", description: "Nyquist, Shannon, capacidad de canal", difficulty: 3, estimatedMinutes: 140 },
            { id: "cd-8", subjectId: "cd", name: "Tipos de transmisión", description: "Serial, paralelo, simplex, dúplex", difficulty: 2, estimatedMinutes: 100 },
            { id: "cd-9", subjectId: "cd", name: "Canales de comunicaciones", description: "Par trenzado, coaxial, fibra, wireless", difficulty: 2, estimatedMinutes: 140 },
            { id: "cd-10", subjectId: "cd", name: "Modelo OSI y TCP/IP", description: "Capas, funciones, protocolos, encapsulamiento", difficulty: 3, estimatedMinutes: 200 },
            { id: "cd-11", subjectId: "cd", name: "Modulación y multiplexación", description: "AM, FM, PM, FDM, TDM, WDM, CDMA", difficulty: 3, estimatedMinutes: 180 },
            { id: "cd-12", subjectId: "cd", name: "Teoría de la información", description: "Shannon, Huffman, compresión", difficulty: 4, estimatedMinutes: 160 },
            { id: "cd-13", subjectId: "cd", name: "Medios físicos", description: "Cableado estructurado, fibra, wireless, IEEE", difficulty: 2, estimatedMinutes: 140 },
            { id: "cd-14", subjectId: "cd", name: "Detección de errores", description: "Paridad, CRC, Hamming, ARQ", difficulty: 3, estimatedMinutes: 160 },
          ],
        },
        {
          id: "an",
          name: "Análisis Numérico",
          code: "ISI-306",
          level: 3,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Métodos numéricos para resolución aproximada de problemas matemáticos.",
          category: "math" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 6,
          keyConcepts: ["Propagación de errores", "Métodos no lineales", "Interpolación", "Integración numérica", "Sistemas de ecuaciones lineales"],
          prerequisites: ["am2"],
          bibliography: {
            official: [
              "Bertsekas, D. & Tsitsiklis, J. Introduction to Probability. Athena Scientific.",
              "DeGroot, M. & Schervish, M. Probability and Statistics. 5a edicion. Pearson.",
              "Walpole, R. Probability and Statistics for Engineers. 9a edicion. Pearson."
            ],
            complementary: [
              "Ross, S. A First Course in Probability. 10a edicion. Pearson.",
              "Hogg, R. et al. Probability and Statistical Inference. 10a edicion. Pearson."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre probabilidad, distribuciones, inferencia estadistica y analisis de datos.",
            practice: "Resolucion de problemas, uso de herramientas estadisticas (R, Python), analisis de datos.",
            activities: [
              "Resolucion de ejercicios de probabilidad",
              "Analisis de datos con Python/R",
              "Trabajos Practicos de estadistica",
              "Inferencia estadistica practica",
              "Simulaciones de distribuciones"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final escrito con ejercicios de probabilidad y estadistica.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los conceptos fundamentales de probabilidad.",
            "Calcular probabilidades usando distribuciones de probabilidad.",
            "Aplicar inferencia estadistica: estimacion y prueba de hipotesis.",
            "Analizar datos usando herramientas estadisticas."
          ],
          competencies: [
            "Calcular probabilidades con distribuciones discretas y continuas.",
            "Aplicar el Teorema Central del Limite.",
            "Realizar pruebas de hipotesis y construir intervalos de confianza.",
            "Analizar datos con herramientas estadisticas."
          ],
          partialExamples: [
            {
              topic: "Distribuciones",
              question: "En un examen de 20 preguntas con 4 opciones, cual es la probabilidad de aprobar (>=10 correctas) respondiendo al azar?",
              difficulty: 3,
              solution: "X ~ Binomial(n=20, p=0.25). P(X>=10) = Suma(k=10..20) C(20,k)*0.25^k*0.75^(20-k) ≈ 0.0139."
            },
            {
              topic: "Inferencia",
              question: "Calcular intervalo de confianza 95% para la media de una muestra de 36 datos con x̄=50 y s=12.",
              difficulty: 2,
              solution: "IC = x̄ ± z*s/√n = 50 ± 1.96*12/√36 = 50 ± 3.92 = (46.08, 53.92)."
            }
          ],
          topics: [
            { id: "an-1", subjectId: "an", name: "Introducción y errores", description: "Absoluto, relativo, redondeo, truncamiento", difficulty: 2, estimatedMinutes: 140 },
            { id: "an-2", subjectId: "an", name: "Ceros de funciones", description: "Bisección, Newton-Raphson, secante", difficulty: 3, estimatedMinutes: 200 },
            { id: "an-3", subjectId: "an", name: "Interpolación polinómica", description: "Lagrange, Newton, splines, error", difficulty: 3, estimatedMinutes: 220 },
            { id: "an-4", subjectId: "an", name: "Aproximación de funciones", description: "Mínimos cuadrados, polinómica", difficulty: 3, estimatedMinutes: 180 },
            { id: "an-5", subjectId: "an", name: "Integración numérica", description: "Trapecio, Simpson, gaussiana, error", difficulty: 3, estimatedMinutes: 200 },
            { id: "an-6", subjectId: "an", name: "Diferenciación numérica", description: "Diferencias finitas, error", difficulty: 3, estimatedMinutes: 120 },
            { id: "an-7", subjectId: "an", name: "Resolución de EDOs", description: "Euler, Runge-Kutta, estabilidad", difficulty: 4, estimatedMinutes: 240 },
            { id: "an-8", subjectId: "an", name: "Sistemas de ecuaciones lineales", description: "Gauss, LU, Cholesky", difficulty: 3, estimatedMinutes: 200 },
            { id: "an-9", subjectId: "an", name: "Métodos iterativos: Jacobi, Gauss-Seidel", description: "Convergencia, diagonal dominante", difficulty: 4, estimatedMinutes: 180 },
            { id: "an-10", subjectId: "an", name: "Estabilidad numérica", description: "Estabilidad, condicionamiento, rigidez", difficulty: 4, estimatedMinutes: 140 },
            { id: "an-11", subjectId: "an", name: "Aplicaciones computacionales", description: "Python/MATLAB, problemas reales", difficulty: 2, estimatedMinutes: 120 },
          ],
        },
        {
          id: "dsi",
          name: "Diseño de Sistemas de Información - Integradora",
          code: "ISI-307",
          level: 3,
          career: "Ingeniería en Sistemas de Información",
          credits: 6,
          hoursPerWeek: 6,
          totalHours: 144,
          recoveryNote: 10,
          description: "Diseño de SI integrando análisis, BD, desarrollo y comunicaciones.",
          category: "engineering" as SubjectCategory,
          difficulty: 5,
          studyHoursPerWeek: 14,
          keyConcepts: ["Arquitectura de SI", "Diseño de BD", "Diseño de interfaces", "UML", "Patrones arquitectónicos", "Especificación técnica"],
          prerequisites: ["asi", "bd"],
          bibliography: {
            official: [
              "Sommerville, I. Software Engineering. 10a edicion. Pearson.",
              "Pressman, R. Software Engineering: A Practitioner's Approach. 9a edicion. McGraw-Hill.",
              "Boehm, B. Software Engineering Economics. Prentice-Hall."
            ],
            complementary: [
              "Martin, R. Clean Architecture. Prentice Hall.",
              "Fowler, M. Patterns of Enterprise Application Architecture. Addison-Wesley.",
              "Evans, E. Domain-Driven Design. Addison-Wesley."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre diseno de sistemas de informacion, arquitecturas y patrones de diseno.",
            practice: "Diseno e implementacion de un sistema de informacion usando patrones arquitectonicos.",
            activities: [
              "Diseno de arquitectura de sistemas de informacion",
              "Implementacion de patrones de diseno",
              "Trabajos Practicos de diseno",
              "Analisis de sistemas existentes",
              "Modelado con UML"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con diseno de arquitectura de un sistema de informacion.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de diseno (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los patrones arquitectonicos de sistemas de informacion.",
            "Disenar sistemas de informacion escalables y mantenibles.",
            "Aplicar principios de diseno orientado a dominio.",
            "Evaluar y comparar arquitecturas de software."
          ],
          competencies: [
            "Disenar arquitecturas de sistemas de informacion.",
            "Aplicar patrones de diseno (MVC, microservicios, eventos).",
            "Evaluar trade-offs en decisiones arquitectonicas.",
            "Modelar dominios con DDD (Domain-Driven Design)."
          ],
          partialExamples: [
            {
              topic: "Patrones arquitectonicos",
              question: "Comparar arquitectura monolitica vs microservicios para una plataforma de e-commerce.",
              difficulty: 3,
              solution: "Monolitica: simple de desarrollar pero dificil de escalar. Microservicios: escalable independientemente pero complejo en operaciones."
            },
            {
              topic: "DDD",
              question: "Identificar bounded contexts para un sistema de gestion hospitalaria.",
              difficulty: 3,
              solution: "Contextos: Pacientes (admision, historial), Personal (agenda, turnos), Farmacia (stock, dispensacion), Facturacion (cuentas, seguros)."
            }
          ],
          topics: [
            { id: "dsi-1", subjectId: "dsi", name: "Metodologías de diseño", description: "Waterfall, prototipado, espiral, ágiles", difficulty: 2, estimatedMinutes: 180 },
            { id: "dsi-2", subjectId: "dsi", name: "Diseño arquitectónico", description: "Capas, cliente-servidor, microservicios, serverless", difficulty: 4, estimatedMinutes: 240 },
            { id: "dsi-3", subjectId: "dsi", name: "Diseño de BD: lógico y físico", description: "Transformación, normalización, indexación", difficulty: 4, estimatedMinutes: 260 },
            { id: "dsi-4", subjectId: "dsi", name: "Diseño de interfaces UX/UI", description: "Wireframes, heurísticas, accesibilidad", difficulty: 3, estimatedMinutes: 200 },
            { id: "dsi-5", subjectId: "dsi", name: "Diseño de comunicaciones", description: "Protocolos, APIs, mensajería, integración", difficulty: 3, estimatedMinutes: 180 },
            { id: "dsi-6", subjectId: "dsi", name: "Patrones arquitectónicos", description: "MVC, Clean, Hexagonal, DDD", difficulty: 4, estimatedMinutes: 220 },
            { id: "dsi-7", subjectId: "dsi", name: "Especificación técnica", description: "Documento de diseño, despliegue, APIs", difficulty: 3, estimatedMinutes: 180 },
            { id: "dsi-8", subjectId: "dsi", name: "UML para diseño: clase, secuencia, componentes", description: "Diagramas de diseño, mapeo análisis-diseño", difficulty: 3, estimatedMinutes: 220 },
            { id: "dsi-9", subjectId: "dsi", name: "Diseño orientado a servicios", description: "SOA, microservicios, API Gateway, service mesh", difficulty: 4, estimatedMinutes: 180 },
            { id: "dsi-10", subjectId: "dsi", name: "Integración de subsistemas", description: "Patrones, ESB,消息队列, ETL", difficulty: 4, estimatedMinutes: 200 },
          ],
        },
      ],
    },
    {
      level: 4,
      name: "Cuarto Año",
      totalHours: 744,
      weeklyHours: 31,
      maxRecoveryNote: 60,
      subjects: [
        {
          id: "legisl",
          name: "Legislación",
          code: "ISI-401",
          level: 4,
          career: "Ingeniería en Sistemas de Información",
          credits: 2,
          hoursPerWeek: 2,
          totalHours: 48,
          recoveryNote: 4,
          description: "Marco legal: contratos, propiedad intelectual, responsabilidad civil y penal informática.",
          category: "general" as SubjectCategory,
          difficulty: 2,
          studyHoursPerWeek: 4,
          keyConcepts: ["Contratos", "Responsabilidad profesional", "Propiedad intelectual", "Protección de datos", "Ciberdelitos", "Peritaje"],
          prerequisites: [],
          bibliography: {
            official: [
              "Acta 866/00 - Ley de Ejercicio Profesional de Ingenieria (Tucuman).",
              "Codigo Civil y Comercial de la Nacion Argentina.",
              "Ley 25.326 - Ley de Proteccion de Datos Personales."
            ],
            complementary: [
              "Ley 11.723 - Propiedad Intelectual.",
              "Ley 26.388 - Delitos Informaticos.",
              "Decreto 158/2018 - Datos Personales."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre legislacion, etica profesional, propiedad intelectual y proteccion de datos.",
            practice: "Analisis de casos judiciales, debates sobre dilemas eticos, simulaciones de situaciones legales.",
            activities: [
              "Analisis de casos legales de ingenieria",
              "Debates sobre dilemas eticos",
              "Simulaciones de situaciones legales",
              "Trabajos Practicos de legislacion",
              "Presentaciones sobre normativa"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con analisis de casos y ejercicios de legislacion.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos y participacion (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender el marco legal del ejercicio profesional de la ingenieria.",
            "Conocer las leyes de proteccion de datos personales y propiedad intelectual.",
            "Analizar dilemas eticos en el ejercicio profesional.",
            "Aplicar la normativa vigente a situaciones reales de la practica."
          ],
          competencies: [
            "Interpretar la legislacion vigente para el ejercicio profesional.",
            "Aplicar normas de proteccion de datos personales.",
            "Actuar eticamente en situaciones de conflicto.",
            "Conocer las obligaciones legales del ingeniero."
          ],
          partialExamples: [
            {
              topic: "Proteccion de datos",
              question: "Una empresa de software recopila datos de usuarios sin su consentimiento. Que leyes vulnera?",
              difficulty: 3,
              solution: "Vulnera la Ley 25.326 (PDPA): requiere consentimiento explicito, informa derechos del titular, y establece sanciones."
            },
            {
              topic: "Propiedad intelectual",
              question: "Un desarrollador crea un software durante su horario laboral. Quien es el titular de los derechos?",
              difficulty: 3,
              solution: "Segun la Ley 11.723 y el Codigo Civil, el empleador es titular si fue creado en relacion de dependencia y dentro del horario laboral."
            }
          ],
          topics: [
            { id: "legisl-1", subjectId: "legisl", name: "Derecho: conceptos generales", description: "Ramas, fuentes, jurisdicción, competencia", difficulty: 1, estimatedMinutes: 120 },
            { id: "legisl-2", subjectId: "legisl", name: "Derecho contractual", description: "Contratos de software, licencias, servicios TI", difficulty: 2, estimatedMinutes: 160 },
            { id: "legisl-3", subjectId: "legisl", name: "Derecho de daños", description: "Responsabilidad civil, contractual y extracontractual", difficulty: 2, estimatedMinutes: 140 },
            { id: "legisl-4", subjectId: "legisl", name: "Responsabilidad profesional", description: "Diligencia, error, seguro, responsabilidad del editor", difficulty: 2, estimatedMinutes: 120 },
            { id: "legisl-5", subjectId: "legisl", name: "Propiedad intelectual", description: "Derechos de autor, copyright, software, titularidad", difficulty: 2, estimatedMinutes: 140 },
            { id: "legisl-6", subjectId: "legisl", name: "Patentes y marcas", description: "Invención, modelo de utilidad, diseño industrial", difficulty: 2, estimatedMinutes: 120 },
            { id: "legisl-7", subjectId: "legisl", name: "Protección de datos personales", description: "Ley 25.326, habeas data, principios", difficulty: 2, estimatedMinutes: 140 },
            { id: "legisl-8", subjectId: "legisl", name: "Legislación informática", description: "Firma digital, documento electrónico", difficulty: 2, estimatedMinutes: 120 },
            { id: "legisl-9", subjectId: "legisl", name: "Delitos informáticos", description: "Acceso no autorizado, sabotaje, estafa digital", difficulty: 2, estimatedMinutes: 120 },
            { id: "legisl-10", subjectId: "legisl", name: "Peritaje y arbitraje", description: "Perito informático, dictamen, arbitraje tecnológico", difficulty: 2, estimatedMinutes: 100 },
            { id: "legisl-11", subjectId: "legisl", name: "Normativa de seguridad", description: "ISO 27001, GDPR, normativa argentina", difficulty: 2, estimatedMinutes: 120 },
          ],
        },
        {
          id: "isw",
          name: "Ingeniería y Calidad de Software",
          code: "ISI-402",
          level: 4,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Estándares de calidad, métricas y técnicas de aseguramiento de la calidad.",
          category: "engineering" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 6,
          keyConcepts: ["Calidad de software", "Estándares ISO", "Métricas", "Testing", "Gestión de proyectos", "Configuración"],
          prerequisites: ["dsi"],
          bibliography: {
            official: [
              "Sommerville, I. Software Engineering. 10a edicion. Pearson.",
              "Pressman, R. Software Engineering: A Practitioner's Approach. 9a edicion. McGraw-Hill.",
              "IEEE Standard 830-1998 - Software Requirements Specifications."
            ],
            complementary: [
              "Wiegers, K. & Beatty, J. Software Requirements. 3a edicion. Microsoft Press.",
              "Cockburn, A. Writing Effective Use Cases. Addison-Wesley.",
              "Schwaber, K. & Sutherland, J. The Scrum Guide."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre ingenieria de requisitos, especificacion de software y verificacion.",
            practice: "Diseno de SRS (Software Requirements Specification), modelado con UML, validacion de requisitos.",
            activities: [
              "Elaboracion de documentos SRS",
              "Modelado con diagramas UML",
              "Talleres de elicitation de requisitos",
              "Trabajos Practicos de especificacion",
              "Validacion y verificacion de requisitos"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final y/o presentacion de documento SRS completo.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de especificacion (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Dominar las tecnicas de elicitation y documentacion de requisitos.",
            "Elaborar documentos SRS segun IEEE 830.",
            "Aplicar modelado UML para la especificacion de software.",
            "Validar y verificar requisitos con stakeholders."
          ],
          competencies: [
            "Elaborar documentos de requisitos de software (SRS).",
            "Modelar sistemas con diagramas UML.",
            "Facilitar talleres de elicitation de requisitos.",
            "Validar requisitos con tecnicas de inspeccion."
          ],
          partialExamples: [
            {
              topic: "Especificacion",
              question: "Redactar requisitos funcionales y no funcionales para un sistema de biblioteca.",
              difficulty: 2,
              solution: "Funcionales: RF-001 El sistema permitira buscar libros por titulo/autor. No funcionales: RNF-001 El tiempo de respuesta < 2 segundos."
            },
            {
              topic: "UML",
              question: "Disenar diagrama de casos de uso para un sistema de autenticacion de usuarios.",
              difficulty: 3,
              solution: "Actores: Usuario, Administrador. Casos de uso: Iniciar sesion, Cerrar sesion, Cambiar contrasena, Gestionar usuarios."
            }
          ],
          topics: [
            { id: "isw-1", subjectId: "isw", name: "Componentes de proyectos de software", description: "Plan, equipo, recursos, cronograma, hitos", difficulty: 2, estimatedMinutes: 160 },
            { id: "isw-2", subjectId: "isw", name: "Gestión de configuración", description: "Control de versiones, cambios, construcción", difficulty: 3, estimatedMinutes: 180 },
            { id: "isw-3", subjectId: "isw", name: "Estándares: ISO 9001, ISO/IEC 25010, CMMI", description: "Madurez, calidad, modelos", difficulty: 3, estimatedMinutes: 200 },
            { id: "isw-4", subjectId: "isw", name: "Plan de aseguramiento de calidad", description: "Revisiones, auditorías, verificación y validación", difficulty: 3, estimatedMinutes: 180 },
            { id: "isw-5", subjectId: "isw", name: "Métricas de software", description: "Producto, proceso, McCabe, líneas de código", difficulty: 3, estimatedMinutes: 180 },
            { id: "isw-6", subjectId: "isw", name: "Ingeniería de requerimientos avanzada", description: "Gestión, trazabilidad, variabilidad", difficulty: 3, estimatedMinutes: 180 },
            { id: "isw-7", subjectId: "isw", name: "Gestión de riesgos", description: "Identificación, análisis, estrategias", difficulty: 3, estimatedMinutes: 140 },
            { id: "isw-8", subjectId: "isw", name: "Elementos de testing", description: "Tipos, niveles, estrategia, automatización", difficulty: 3, estimatedMinutes: 200 },
            { id: "isw-9", subjectId: "isw", name: "Planes de prueba", description: "Planificación, casos, ejecución, métricas", difficulty: 3, estimatedMinutes: 160 },
            { id: "isw-10", subjectId: "isw", name: "Automatización de pruebas", description: "JUnit, Selenium, Cypress, performance", difficulty: 4, estimatedMinutes: 200 },
            { id: "isw-11", subjectId: "isw", name: "ISO/IEC 12207", description: "Procesos del ciclo de vida del software", difficulty: 3, estimatedMinutes: 140 },
            { id: "isw-12", subjectId: "isw", name: "PMBOK y Scrum", description: "Gestión ágil vs tradicional, roles, cerimonias", difficulty: 3, estimatedMinutes: 160 },
          ],
        },
        {
          id: "rd",
          name: "Redes de Datos",
          code: "ISI-403",
          level: 4,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Arquitecturas de redes de datos, protocolos TCP/IP, seguridad y diseño LAN/WAN.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 8,
          keyConcepts: ["Modelo OSI/TCP/IP", "Protocolos", "Direccionamiento IP", "Encaminamiento", "Seguridad", "Redes inalámbricas"],
          prerequisites: ["cd"],
          bibliography: {
            official: [
              "Tanenbaum, A. & Wetherall, D. Computer Networks. 6a edicion. Pearson.",
              "Kurose, J. & Ross, K. Computer Networking: A Top-Down Approach. 8a edicion. Pearson.",
              "Stallings, W. Data and Computer Communications. 10a edicion. Pearson."
            ],
            complementary: [
              "Comer, D. Internetworking with TCP/IP. 6a edicion. Pearson.",
              "Peterson, L. & Davie, B. Computer Networks: A Systems Approach. 6a edicion. Morgan Kaufmann."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre modelos de red, protocolos, capas del modelo OSI/TCP-IP.",
            practice: "Laboratorio con configuracion de redes, analisis de trafico, simulacion con Packet Tracer.",
            activities: [
              "Configuracion de dispositivos de red",
              "Analisis de trafico con Wireshark",
              "Simulacion con Cisco Packet Tracer",
              "Trabajos Practicos de redes",
              "Diseno de topologias de red"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final escrito y practico de redes.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los modelos de red OSI y TCP/IP.",
            "Analizar protocolos de comunicacion de datos.",
            "Configurar dispositivos de red (routers, switches).",
            "Disenar y administrar redes de datos."
          ],
          competencies: [
            "Configurar y administrar redes de datos.",
            "Analizar trafico de red con herramientas de sniffing.",
            "Disenar topologias de red escalables.",
            "Resolver problemas de conectividad."
          ],
          partialExamples: [
            {
              topic: "Modelo OSI",
              question: "Describir que sucede cuando un usuario accede a una pagina web, indicando la capa OSI involucrada.",
              difficulty: 2,
              solution: "DNS (capa 7) resuelve dominio. HTTP (7) genera peticion. TCP (4) establece conexion. IP (3) enruta. Ethernet (2) trama. Fisica (1) transmite bits."
            },
            {
              topic: "Subnetting",
              question: "Dividir la red 192.168.1.0/24 en 4 subredes de igual tamano.",
              difficulty: 3,
              solution: "Mascara /26 (255.255.255.192). Subredes: .0/26 (1-62), .64/26 (65-126), .128/26 (129-190), .192/26 (193-254)."
            }
          ],
          topics: [
            { id: "rd-1", subjectId: "rd", name: "Clasificación de redes: LAN, MAN, WAN", description: "Tipos, topologías, alcance", difficulty: 2, estimatedMinutes: 120 },
            { id: "rd-2", subjectId: "rd", name: "Modelo OSI y TCP/IP", description: "Comparación, encapsulamiento, capas", difficulty: 3, estimatedMinutes: 180 },
            { id: "rd-3", subjectId: "rd", name: "Capa de enlace: IEEE", description: "Ethernet, Wi-Fi, PPP, MAC", difficulty: 3, estimatedMinutes: 200 },
            { id: "rd-4", subjectId: "rd", name: "VLANs", description: "Segmentación, 802.1Q, trunking", difficulty: 3, estimatedMinutes: 160 },
            { id: "rd-5", subjectId: "rd", name: "Redes inalámbricas", description: "Wi-Fi, WPA2/WPA3, roaming", difficulty: 3, estimatedMinutes: 160 },
            { id: "rd-6", subjectId: "rd", name: "Protocolo IP: subredes y IPv6", description: "IPv4, subredes, CIDR, NAT, IPv6", difficulty: 4, estimatedMinutes: 240 },
            { id: "rd-7", subjectId: "rd", name: "Encaminamiento", description: "Estático, dinámico, tablas, métricas", difficulty: 4, estimatedMinutes: 220 },
            { id: "rd-8", subjectId: "rd", name: "TCP y UDP", description: "Características, flujo, congestión, puertos", difficulty: 3, estimatedMinutes: 200 },
            { id: "rd-9", subjectId: "rd", name: "Capa de aplicación: HTTP, DNS, SMTP", description: "Protocolos de aplicación, troubleshooting", difficulty: 3, estimatedMinutes: 180 },
            { id: "rd-10", subjectId: "rd", name: "Seguridad de redes", description: "Firewalls, IDS/IPS, VPN, zero trust", difficulty: 4, estimatedMinutes: 220 },
            { id: "rd-11", subjectId: "rd", name: "VPN", description: "Sitio a sitio, acceso remoto, IPSec, SSL", difficulty: 4, estimatedMinutes: 160 },
            { id: "rd-12", subjectId: "rd", name: "Monitoreo de redes", description: "Wireshark, Nagios, Zabbix, SNMP", difficulty: 3, estimatedMinutes: 160 },
            { id: "rd-13", subjectId: "rd", name: "QoS", description: "Calidad de servicio, priorización, tráfico", difficulty: 3, estimatedMinutes: 140 },
          ],
        },
        {
          id: "io",
          name: "Investigación Operativa",
          code: "ISI-404",
          level: 4,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "Métodos de IO: programación lineal, transporte, asignación y teoría de colas.",
          category: "math" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 8,
          keyConcepts: ["Programación lineal", "Simplex", "Transporte y asignación", "Programación dinámica", "Teoría de colas", "Optimización"],
          prerequisites: ["am2", "peyest"],
          bibliography: {
            official: [
              "Hillier, F. & Lieberman, G. Introduction to Operations Research. 10a edicion. McGraw-Hill.",
              "Winston, W. Operations Research: Applications and Algorithms. 4a edicion. Cengage.",
              "Taha, H. Operations Research: An Introduction. 10a edicion. Pearson."
            ],
            complementary: [
              "Hamacher, H. Operations Research. McGraw-Hill.",
              "Holland, J. Adaptation in Natural and Artificial Systems. MIT Press."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre optimizacion, programacion lineal, teoria de colas y simulacion.",
            practice: "Resolucion de problemas con software de optimizacion (GAMS, Excel Solver), simulacion con Arena.",
            activities: [
              "Resolucion de problemas de programacion lineal",
              "Simulacion de sistemas con Arena",
              "Optimizacion con GAMS",
              "Trabajos Practicos de IO",
              "Analisis de colas de espera"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con ejercicios de optimizacion y simulacion.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Formular problemas de optimizacion con programacion lineal.",
            "Resolver problemas con metodo simplex.",
            "Analizar sistemas de colas de espera.",
            "Aplicar simulacion para resolver problemas de ingenieria."
          ],
          competencies: [
            "Formular y resolver problemas de programacion lineal.",
            "Analizar sistemas de colas de espera.",
            "Aplicar simulacion para optimizar procesos.",
            "Usar herramientas de optimizacion (GAMS, Solver)."
          ],
          partialExamples: [
            {
              topic: "Programacion lineal",
              question: "Maximizar Z = 3x + 2y sujeto a: x + y <= 4, x + 3y <= 6, x,y >= 0.",
              difficulty: 3,
              solution: "Graficar restricciones. Puntos factibles: (0,0), (4,0), (3,1), (0,2). Z max = 11 en (3,1)."
            },
            {
              topic: "Colas de espera",
              question: "Calcular Lq y Wq para una cola M/M/1 con lambda=8 y mu=10.",
              difficulty: 3,
              solution: "rho=lambda/mu=0.8. Lq=rho^2/(1-rho)=3.2. Wq=Lq/lambda=0.4 horas=24 min."
            }
          ],
          topics: [
            { id: "io-1", subjectId: "io", name: "Introducción a la IO", description: "Definición, historia, áreas de aplicación", difficulty: 2, estimatedMinutes: 120 },
            { id: "io-2", subjectId: "io", name: "Programación lineal: simplex", description: "Formulación, gráfica, simplex, tableau", difficulty: 3, estimatedMinutes: 280 },
            { id: "io-3", subjectId: "io", name: "Dualidad y sensibilidad", description: "Dual, interpretación económica, sensibilidad", difficulty: 4, estimatedMinutes: 200 },
            { id: "io-4", subjectId: "io", name: "Transporte y asignación", description: "Transporte: noroeste, vogel; asignación húngaro", difficulty: 4, estimatedMinutes: 240 },
            { id: "io-5", subjectId: "io", name: "Programación entera", description: "Branch and bound, corte, binarias", difficulty: 5, estimatedMinutes: 220 },
            { id: "io-6", subjectId: "io", name: "Programación dinámica", description: "Optimalidad, Bellman, aplicaciones", difficulty: 4, estimatedMinutes: 200 },
            { id: "io-7", subjectId: "io", name: "Modelos de inventarios", description: "EOQ, faltantes, demanda variable", difficulty: 3, estimatedMinutes: 180 },
            { id: "io-8", subjectId: "io", name: "Teoría de colas", description: "M/M/1, M/M/c, M/G/1, métricas", difficulty: 4, estimatedMinutes: 220 },
            { id: "io-9", subjectId: "io", name: "Teoría de grafos aplicada", description: "Caminos mínimos, expansión, flujos máximos", difficulty: 4, estimatedMinutes: 200 },
            { id: "io-10", subjectId: "io", name: "Análisis de redes", description: "CPM, PERT, holguras, recursos", difficulty: 3, estimatedMinutes: 180 },
            { id: "io-11", subjectId: "io", name: "Simulación de sistemas", description: "Números aleatorios, validez de modelos", difficulty: 3, estimatedMinutes: 160 },
            { id: "io-12", subjectId: "io", name: "Herramientas computacionales", description: "Excel Solver, LINGO, Gurobi", difficulty: 2, estimatedMinutes: 120 },
          ],
        },
        {
          id: "sim",
          name: "Simulación",
          code: "ISI-405",
          level: 4,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Simulación de sistemas discretos y continuos. Números aleatorios, diseño de experimentos.",
          category: "cs" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 6,
          keyConcepts: ["Modelado de sistemas", "Números aleatorios", "Diseño de experimentos", "Simulación de colas", "Validación"],
          prerequisites: ["peyest"],
          bibliography: {
            official: [
              "Banks, J. et al. Discrete-Event System Simulation. 5a edicion. Pearson.",
              "Law, A. Simulation Modeling and Analysis. 5a edicion. McGraw-Hill.",
              "Kelton, W. et al. Simulation with Arena. 6a edicion. McGraw-Hill."
            ],
            complementary: [
              "Pegden, C. Introduction to Simulation with SIMAN. McGraw-Hill.",
              "Goldberg, D. Genetic Algorithms. Pearson."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre conceptos de simulacion, modelos de colas, generacion de numeros aleatorios.",
            practice: "Laboratorio con Arena, generacion de distribuciones, verificacion y validacion de modelos.",
            activities: [
              "Modelado de sistemas con Arena",
              "Generacion de distribuciones de probabilidad",
              "Verificacion y validacion de modelos",
              "Trabajos Practicos de simulacion",
              "Analisis de resultados"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con modelado y analisis de un sistema de simulacion.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los fundamentos de la simulacion discreta.",
            "Modelar sistemas usando el metodo Monte Carlo.",
            "Generar y verificar distribuciones de probabilidad.",
            "Analizar resultados de simulacion con intervalos de confianza."
          ],
          competencies: [
            "Modelar sistemas discretos con Arena.",
            "Generar variables aleatorias con diferentes distribuciones.",
            "Verificar y validar modelos de simulacion.",
            "Interpretar y comunicar resultados de simulacion."
          ],
          partialExamples: [
            {
              topic: "Simulacion Monte Carlo",
              question: "Estimar pi usando el metodo Monte Carlo con 10,000 puntos aleatorios.",
              difficulty: 2,
              solution: "Generar puntos (x,y) uniformes en [0,1]. Contar los que caen dentro del circulo (x^2+y^2<=1). pi ≈ 4 x (puntos_dentro / total)."
            },
            {
              topic: "Distribuciones",
              question: "Generar numeros exponenciales con lambda=2 usando el metodo de inversion.",
              difficulty: 3,
              solution: "X = -ln(1-U)/lambda donde U ~ Uniforme(0,1). Con lambda=2: X = -ln(1-U)/2."
            }
          ],
          topics: [
            { id: "sim-1", subjectId: "sim", name: "Conceptos de simulación", description: "Definición, tipos, ventajas, limitaciones", difficulty: 2, estimatedMinutes: 140 },
            { id: "sim-2", subjectId: "sim", name: "Modelado y simulación", description: "Determinísticos, estocásticos, clasificación", difficulty: 2, estimatedMinutes: 160 },
            { id: "sim-3", subjectId: "sim", name: "Números pseudoaleatorios", description: "Congruenciales, bondad de ajuste, pruebas", difficulty: 3, estimatedMinutes: 180 },
            { id: "sim-4", subjectId: "sim", name: "Variables aleatorias", description: "Transformada inversa, aceptación-rechazo", difficulty: 3, estimatedMinutes: 200 },
            { id: "sim-5", subjectId: "sim", name: "Diseño de experimentos", description: "Réplicas, initial transient, estadísticas", difficulty: 3, estimatedMinutes: 180 },
            { id: "sim-6", subjectId: "sim", name: "Validación de modelos", description: "Validación y verificación, contraste, sensibilidad", difficulty: 3, estimatedMinutes: 140 },
            { id: "sim-7", subjectId: "sim", name: "Simulación de sistemas discretos", description: "Eventos discretos, colas, inventarios", difficulty: 4, estimatedMinutes: 260 },
            { id: "sim-8", subjectId: "sim", name: "Simulación continua", description: "EDOs, dinámica de sistemas", difficulty: 4, estimatedMinutes: 180 },
            { id: "sim-9", subjectId: "sim", name: "Reducción de varianza", description: "Inversa, estratificación, complementarias", difficulty: 4, estimatedMinutes: 160 },
            { id: "sim-10", subjectId: "sim", name: "Herramientas: Arena, Simul8, AnyLogic", description: "SimPy, implementación práctica", difficulty: 3, estimatedMinutes: 200 },
          ],
        },
        {
          id: "tautom",
          name: "Tecnologías para la Automatización",
          code: "ISI-406",
          level: 4,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Automatización industrial: sistemas de control, PLCs, SCADA, sistemas distribuidos.",
          category: "engineering" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 6,
          keyConcepts: ["Control automático", "PLCs", "SCADA", "Protocolos industriales", "Sensores", "Integración de sistemas"],
          prerequisites: ["fis2"],
          bibliography: {
            official: [
              "Ogata, K. Modern Control Engineering. 5a edicion. Pearson.",
              "Kuo, B. Automatic Control Systems. 9a edicion. Wiley.",
              "Nise, N. Control Systems Engineering. 8a edicion. Wiley."
            ],
            complementary: [
              "Dorf, R. & Bishop, R. Modern Control Systems. 13a edicion. Pearson.",
              "Astrom, K. & Murray, R. Feedback Systems. Princeton University Press."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre sistemas de control, modelos matematicos, estabilidad y diseno de controladores.",
            practice: "Laboratorio con MATLAB/Simulink para analisis y diseno de sistemas de control.",
            activities: [
              "Analisis de sistemas de control con MATLAB",
              "Diseno de controladores PID",
              "Simulacion de sistemas en lazo cerrado",
              "Trabajos Practicos de automatizacion",
              "Analisis de estabilidad"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con diseno y analisis de sistemas de control.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Modelar sistemas de control usando ecuaciones diferenciales.",
            "Analizar estabilidad de sistemas con criterios de Routh y Nyquist.",
            "Disenar controladores PID.",
            "Implementar sistemas de control en tiempo real."
          ],
          competencies: [
            "Modelar sistemas de control con funciones de transferencia.",
            "Analizar estabilidad usando Routh-Hurwitz y Nyquist.",
            "Disenar controladores PID para sistemas de primer y segundo orden.",
            "Implementar algoritmos de control en microcontroladores."
          ],
          partialExamples: [
            {
              topic: "Estabilidad",
              question: "Determinar la estabilidad del sistema con G(s) = 1/(s^3 + 2s^2 + s + 1) usando el criterio de Routh.",
              difficulty: 4,
              solution: "Crear tabla de Routh con coeficientes: 1, 1; 2, 1; (2*1-1*1)/2=0.5, 0; 1, 0. Todos positivos -> estable."
            },
            {
              topic: "Control PID",
              question: "Disenar un controlador PID para un sistema de segundo orden con sobrepaso < 5%.",
              difficulty: 4,
              solution: "Zeta >= 0.707 para <5% sobrepaso. Ajustar Kp para tiempo de subida, Ki para error en estado estable, Kd para atenuar oscilaciones."
            }
          ],
          topics: [
            { id: "tautom-1", subjectId: "tautom", name: "Fundamentos de automatización", description: "Definición, evolución, niveles, arquitecturas", difficulty: 1, estimatedMinutes: 120 },
            { id: "tautom-2", subjectId: "tautom", name: "Sistemas de control: lazo abierto y cerrado", description: "Controladores, retroalimentación, estabilidad", difficulty: 3, estimatedMinutes: 200 },
            { id: "tautom-3", subjectId: "tautom", name: "Controladores PID", description: "P, I, D, sintonía, Ziegler-Nichols", difficulty: 3, estimatedMinutes: 200 },
            { id: "tautom-4", subjectId: "tautom", name: "PLCs: arquitectura y programación", description: "Arquitectura, módulos, E/S, ciclo de escaneo", difficulty: 3, estimatedMinutes: 220 },
            { id: "tautom-5", subjectId: "tautom", name: "Lenguajes de PLCs", description: "Ladder, Function Block, Structured Text, IEC 61131-3", difficulty: 3, estimatedMinutes: 200 },
            { id: "tautom-6", subjectId: "tautom", name: "Sistemas SCADA", description: "Supervisión, HMI, alarmas, tendencias", difficulty: 3, estimatedMinutes: 180 },
            { id: "tautom-7", subjectId: "tautom", name: "DCS", description: "Control distribuido, comparación con PLC", difficulty: 3, estimatedMinutes: 140 },
            { id: "tautom-8", subjectId: "tautom", name: "Protocolos industriales: Modbus, Profibus", description: "Comunicación industrial, EtherNet/IP", difficulty: 3, estimatedMinutes: 180 },
            { id: "tautom-9", subjectId: "tautom", name: "Sensores y adquisición de datos", description: "Tipos, transductores, condicionamiento, muestreo", difficulty: 2, estimatedMinutes: 160 },
            { id: "tautom-10", subjectId: "tautom", name: "Automatización de procesos", description: "Secuencias, diagramas de estados, motores", difficulty: 3, estimatedMinutes: 180 },
            { id: "tautom-11", subjectId: "tautom", name: "Integración de sistemas", description: "MES, ERP-PLC, Industria 4.0, ISA-95", difficulty: 3, estimatedMinutes: 160 },
          ],
        },
        {
          id: "asiadm",
          name: "Administración de Sistemas de Información - Integradora",
          code: "ISI-407",
          level: 4,
          career: "Ingeniería en Sistemas de Información",
          credits: 6,
          hoursPerWeek: 6,
          totalHours: 144,
          recoveryNote: 10,
          description: "Administración y gestión de SI: infraestructura, soporte, seguridad y usuarios.",
          category: "engineering" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 12,
          keyConcepts: ["Gestión de infraestructura TI", "ITIL", "Seguridad informática", "Monitoreo", "Gestión de cambios", "Continuidad del negocio"],
          prerequisites: ["dsi", "rd"],
          bibliography: {
            official: [
              "O'Brien, J. & Marakas, G. Management Information Systems. 10a edicion. McGraw-Hill.",
              "Laudon, K. & Laudon, J. Management Information Systems. 16a edicion. Pearson.",
              "Baltzan, P. Business Driven Information Systems. 5a edicion. McGraw-Hill."
            ],
            complementary: [
              "Turban, E. Information Technology for Management. 10a edicion. Wiley.",
              "Rainer, R. Introduction to Information Systems. 3a edicion. Wiley."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre gestion de sistemas de informacion, gobierno de TI y alineacion estrategica.",
            practice: "Analisis de casos de empresas, planificacion estrategica de TI, metricas de gestion.",
            activities: [
              "Analisis de casos de gobierno de TI",
              "Planificacion estrategica de TI",
              "Definicion de metricas e indicadores",
              "Trabajos Practicos de gestion de SI",
              "Presentaciones sobre gobierno de TI"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con analisis de casos de gestion de sistemas de informacion.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos y participacion (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender el gobierno de TI y su relacion con la estrategia empresarial.",
            "Aplicar marcos de referencia como COBIT e ITIL.",
            "Gestionar proyectos de TI con enfoques agiles.",
            "Evaluar el retorno de inversion en tecnologias de informacion."
          ],
          competencies: [
            "Aplicar marcos de gobierno de TI (COBIT, ITIL).",
            "Evaluar proyectos de TI con metricas financieras.",
            "Gestionar la alineacion entre TI y negocio.",
            "Implementar procesos de gestion de servicios de TI."
          ],
          partialExamples: [
            {
              topic: "Gobierno de TI",
              question: "Implementar un marco de gobierno de TI usando COBIT 2019 para una empresa mediana.",
              difficulty: 3,
              solution: "Definir objetivos de gobierno -> Evaluar procesos actuales -> Identificar gap -> Planificar mejoras -> Monitorear con KPIs."
            },
            {
              topic: "ROI",
              question: "Calcular el ROI de un proyecto de ERP con inversion $500,000 y beneficios anuales $200,000 durante 4 anos.",
              difficulty: 2,
              solution: "Beneficio neto = 800,000 - 500,000 = 300,000. ROI = 300,000/500,000 = 60%."
            }
          ],
          topics: [
            { id: "asiadm-1", subjectId: "asiadm", name: "Gestión de infraestructura TI", description: "Data centers, servidores, almacenamiento, cloud", difficulty: 3, estimatedMinutes: 200 },
            { id: "asiadm-2", subjectId: "asiadm", name: "Administración de servidores", description: "Windows/Linux, DNS, DHCP, AD, virtualización", difficulty: 3, estimatedMinutes: 220 },
            { id: "asiadm-3", subjectId: "asiadm", name: "Gestión de BD en producción", description: "Backup, recuperación, réplica, rendimiento", difficulty: 4, estimatedMinutes: 200 },
            { id: "asiadm-4", subjectId: "asiadm", name: "Monitoreo y rendimiento", description: "Nagios, Zabbix, Prometheus, SLA", difficulty: 3, estimatedMinutes: 180 },
            { id: "asiadm-5", subjectId: "asiadm", name: "Gestión de incidentes: ITIL", description: "Incidente, problema, cambio, servicio", difficulty: 3, estimatedMinutes: 200 },
            { id: "asiadm-6", subjectId: "asiadm", name: "Seguridad informática", description: "Política, amenazas, vulnerabilidades, auditoría", difficulty: 3, estimatedMinutes: 200 },
            { id: "asiadm-7", subjectId: "asiadm", name: "Gestión de cambios", description: "Evaluación, aprobación, implementación", difficulty: 3, estimatedMinutes: 140 },
            { id: "asiadm-8", subjectId: "asiadm", name: "Gestión de usuarios", description: "Provisioning, permisos, directorio, identidad", difficulty: 3, estimatedMinutes: 140 },
            { id: "asiadm-9", subjectId: "asiadm", name: "Continuidad del negocio", description: "DRP, BCP, RTO, RPO, testing", difficulty: 3, estimatedMinutes: 160 },
            { id: "asiadm-10", subjectId: "asiadm", name: "Gestión de proveedores y SLA", description: "Contratación, OLA, Underpinning Contracts", difficulty: 2, estimatedMinutes: 140 },
          ],
        },
      ],
    },
    {
      level: 5,
      name: "Quinto Año",
      totalHours: 768,
      weeklyHours: 32,
      maxRecoveryNote: 60,
      subjects: [
        {
          id: "ia",
          name: "Inteligencia Artificial",
          code: "ISI-501",
          level: 5,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Fundamentos y aplicaciones de la IA: búsqueda, conocimiento, ML, redes neuronales y PLN.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 6,
          keyConcepts: ["Búsqueda y resolución de problemas", "Representación del conocimiento", "Machine learning", "Deep learning", "NLP", "Sistemas expertos"],
          prerequisites: ["io", "sim"],
          bibliography: {
            official: [
              "Russell, S. & Norvig, P. Artificial Intelligence: A Modern Approach. 4a edicion. Pearson.",
              "Goodfellow, I. et al. Deep Learning. MIT Press.",
              "Bishop, C. Pattern Recognition and Machine Learning. Springer."
            ],
            complementary: [
              "Ng, A. Machine Learning (Coursera). Stanford.",
              "LeCun, Y. et al. Deep Learning. Nature."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre IA avanzada, deep learning, redes neuronales y procesamiento de lenguaje natural.",
            practice: "Laboratorio con TensorFlow/PyTorch, implementacion de redes neuronales, analisis de datos.",
            activities: [
              "Implementacion de redes neuronales con TensorFlow",
              "Entrenamiento de modelos de clasificacion",
              "Analisis de conjuntos de datos reales",
              "Trabajos Practicos de deep learning",
              "Presentaciones sobre IA"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con ejercicios de IA y deep learning.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Dominar las tecnicas de aprendizaje profundo.",
            "Implementar redes neuronales convolucionales y recurrentes.",
            "Aplicar modelos de PLN (procesamiento de lenguaje natural).",
            "Evaluar el rendimiento de modelos de IA."
          ],
          competencies: [
            "Implementar redes neuronales con TensorFlow/PyTorch.",
            "Disenar arquitecturas CNN, RNN y transformers.",
            "Aplicar tecnicas de transfer learning.",
            "Evaluar modelos con metricas de precision, recall y F1."
          ],
          partialExamples: [
            {
              topic: "Redes neuronales",
              question: "Disenar una red neuronal para clasificar imagenes de digitos (MNIST).",
              difficulty: 3,
              solution: "Input: 784 (28x28). Capas: Dense(128, relu) -> Dropout(0.2) -> Dense(64, relu) -> Dense(10, softmax). Optimizer: Adam. Loss: categorical_crossentropy."
            },
            {
              topic: "PLN",
              question: "Implementar un clasificador de sentimiento usando LSTM.",
              difficulty: 4,
              solution: "Embedding -> LSTM(128) -> Dense(64, relu) -> Dense(1, sigmoid). Entrenar con reviews de IMDB. Binary crossentropy."
            }
          ],
          topics: [
            { id: "ia-1", subjectId: "ia", name: "Introducción a la IA", description: "Definición, historia, agentes, entornos", difficulty: 2, estimatedMinutes: 140 },
            { id: "ia-2", subjectId: "ia", name: "Búsqueda en espacios de estados", description: "BFS, DFS, A*, genéticos, simulated annealing", difficulty: 3, estimatedMinutes: 260 },
            { id: "ia-3", subjectId: "ia", name: "Representación del conocimiento", description: "Lógica, ontologías, redes semánticas, marcos", difficulty: 4, estimatedMinutes: 240 },
            { id: "ia-4", subjectId: "ia", name: "Razonamiento automatizado", description: "Inferencia lógica, chaining, sistemas expertos", difficulty: 4, estimatedMinutes: 200 },
            { id: "ia-5", subjectId: "ia", name: "Machine learning: supervisado y no supervisado", description: "Regresión, clasificación, clustering, evaluación", difficulty: 4, estimatedMinutes: 320 },
            { id: "ia-6", subjectId: "ia", name: "Redes neuronales y deep learning", description: "Perceptrón, MLP, CNN, RNN, transformers", difficulty: 5, estimatedMinutes: 340 },
            { id: "ia-7", subjectId: "ia", name: "NLP", description: "Tokenización, embeddings, BERT, GPT, sentimiento", difficulty: 5, estimatedMinutes: 300 },
            { id: "ia-8", subjectId: "ia", name: "Visión por computadora", description: "Procesamiento de imagen, CNN visión, detección", difficulty: 5, estimatedMinutes: 240 },
            { id: "ia-9", subjectId: "ia", name: "Algoritmos genéticos", description: "Población, selección, cruza, mutación, fitness", difficulty: 4, estimatedMinutes: 180 },
            { id: "ia-10", subjectId: "ia", name: "IA generativa", description: "GANs, VAEs, diffusion, ética", difficulty: 5, estimatedMinutes: 200 },
            { id: "ia-11", subjectId: "ia", name: "Ética en IA", description: "Sesgo, explicabilidad, regulación, impacto", difficulty: 3, estimatedMinutes: 120 },
            { id: "ia-12", subjectId: "ia", name: "Aplicaciones en SI", description: "Automatización, predicción, chatbots", difficulty: 3, estimatedMinutes: 140 },
          ],
        },
        {
          id: "cdatos",
          name: "Ciencia de Datos",
          code: "ISI-502",
          level: 5,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Exploración, limpieza, transformación, modelado y visualización de grandes volúmenes de datos.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 6,
          keyConcepts: ["Ciclo de vida de datos", "Limpieza", "EDA", "Modelado predictivo", "Feature engineering", "Big Data"],
          prerequisites: ["peyest"],
          bibliography: {
            official: [
              "McKinney, W. Python for Data Analysis. 3a edicion. O'Reilly.",
              "James, G. et al. An Introduction to Statistical Learning. 2a edicion. Springer.",
              "Kelleher, J. & Tierney, B. Data Science. MIT Press."
            ],
            complementary: [
              "VanderPlas, J. Python Data Science Handbook. O'Reilly.",
              "Wickham, H. & Grolemund, G. R for Data Science. O'Reilly."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre ciencia de datos, analisis exploratorio, visualizacion y modelado estadistico.",
            practice: "Laboratorio con Python (Pandas, Matplotlib, Scikit-learn) para analisis de datos reales.",
            activities: [
              "Analisis exploratorio de datos con Pandas",
              "Visualizacion con Matplotlib y Seaborn",
              "Modelado con Scikit-learn",
              "Trabajos Practicos de ciencia de datos",
              "Proyectos de analisis de datos"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con analisis de datos y modelado.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Dominar tecnicas de analisis exploratorio de datos.",
            "Implementar pipelines de ciencia de datos con Python.",
            "Aplicar modelos de machine learning a problemas reales.",
            "Comunicar resultados de analisis de forma efectiva."
          ],
          competencies: [
            "Realizar analisis exploratorio de datos con Pandas.",
            "Crear visualizaciones efectivas con Matplotlib/Seaborn.",
            "Entrenar y evaluar modelos de ML con Scikit-learn.",
            "Comunicar hallazgos de datos a stakeholders."
          ],
          partialExamples: [
            {
              topic: "Analisis exploratorio",
              question: "Analizar un dataset de ventas: identificar tendencias, valores atipicos y correlaciones.",
              difficulty: 2,
              solution: "Usar df.describe(), df.info(), Matriz de correlacion, boxplots para outliers, series temporales para tendencias."
            },
            {
              topic: "Modelado",
              question: "Implementar una regresion lineal para predecir precios de viviendas.",
              difficulty: 3,
              solution: "from sklearn.linear_model import LinearRegression; model.fit(X_train, y_train); y_pred = model.predict(X_test); evaluar con R2 y MSE."
            }
          ],
          topics: [
            { id: "cdatos-1", subjectId: "cdatos", name: "Introducción y ciclo de vida de datos", description: "Roles, ciclo de vida, flujo de trabajo", difficulty: 1, estimatedMinutes: 120 },
            { id: "cdatos-2", subjectId: "cdatos", name: "Recopilación de datos", description: "Fuentes, APIs, web scraping, calidad", difficulty: 2, estimatedMinutes: 160 },
            { id: "cdatos-3", subjectId: "cdatos", name: "Limpieza y transformación", description: "Faltantes, outliers, normalización, encoding", difficulty: 3, estimatedMinutes: 200 },
            { id: "cdatos-4", subjectId: "cdatos", name: "EDA y visualización", description: "Exploratorio, distribuciones, correlaciones", difficulty: 3, estimatedMinutes: 220 },
            { id: "cdatos-5", subjectId: "cdatos", name: "Estadística aplicada", description: "Inferencia, pruebas, correlación, regresión", difficulty: 3, estimatedMinutes: 180 },
            { id: "cdatos-6", subjectId: "cdatos", name: "Modelado predictivo", description: "Selección, validación cruzada, ensemble", difficulty: 4, estimatedMinutes: 260 },
            { id: "cdatos-7", subjectId: "cdatos", name: "Feature engineering", description: "Creación, selección, importancia, reducción", difficulty: 4, estimatedMinutes: 200 },
            { id: "cdatos-8", subjectId: "cdatos", name: "Herramientas: Python, pandas, scikit-learn", description: "Entorno, pandas, scikit-learn", difficulty: 3, estimatedMinutes: 200 },
            { id: "cdatos-9", subjectId: "cdatos", name: "Visualización: Matplotlib, Tableau", description: "Gráficos, dashboards, interactiva", difficulty: 2, estimatedMinutes: 160 },
            { id: "cdatos-10", subjectId: "cdatos", name: "Big Data: Hadoop, Spark", description: "Distribuido, MapReduce, Spark, escalar", difficulty: 4, estimatedMinutes: 220 },
            { id: "cdatos-11", subjectId: "cdatos", name: "Ética en datos", description: "Privacidad, sesgo, GDPR, gobernanza", difficulty: 3, estimatedMinutes: 120 },
          ],
        },
        {
          id: "sgest",
          name: "Sistemas de Gestión",
          code: "ISI-503",
          level: 5,
          career: "Ingeniería en Sistemas de Información",
          credits: 4,
          hoursPerWeek: 4,
          totalHours: 96,
          recoveryNote: 8,
          description: "ERP, CRM, SCM y su integración con los sistemas de información.",
          category: "engineering" as SubjectCategory,
          difficulty: 3,
          studyHoursPerWeek: 8,
          keyConcepts: ["Sistemas ERP", "CRM y SCM", "Business Intelligence", "Integración de sistemas", "Gobierno de TI", "Transformación digital"],
          prerequisites: ["asiadm"],
          bibliography: {
            official: [
              "Schwalbe, K. Information Technology Project Management. 9a edicion. Cengage.",
              "Kerzner, H. Project Management: A Systems Approach. 12a edicion. Wiley.",
              "PMI. A Guide to the Project Management Body of Knowledge (PMBOK). 7a edicion."
            ],
            complementary: [
              "Wysocki, R. Effective Project Management. 8a edicion. Wiley.",
              "Meredith, J. Project Management: A Managerial Approach. 10a edicion. Wiley."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre gestion de proyectos de TI, planificacion, ejecucion y control.",
            practice: "Simulacion de proyectos de TI, uso de herramientas de gestion (MS Project, Jira), trabajo en equipo.",
            activities: [
              "Planificacion de proyectos de TI con MS Project",
              "Uso de Jira para gestion agil",
              "Elaboracion de presupuestos de proyectos",
              "Trabajos Practicos de gestion de proyectos",
              "Presentaciones de proyectos"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final y/o presentacion de proyecto integrador de TI.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos y participacion (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Gestionar proyectos de TI usando metodologias agiles y tradicionales.",
            "Planificar, ejecutar y controlar proyectos de software.",
            "Gestionar riesgos y calidad en proyectos de TI.",
            "Evaluar el rendimiento de proyectos con metricas."
          ],
          competencies: [
            "Planificar y ejecutar proyectos de TI con MS Project/Jira.",
            "Gestionar riesgos y calidad en proyectos.",
            "Elaborar presupuestos y cronogramas de proyectos.",
            "Aplicar metricas de gestion de proyectos."
          ],
          partialExamples: [
            {
              topic: "Gestion de riesgos",
              question: "Identificar y evaluar riesgos en un proyecto de migracion de base de datos.",
              difficulty: 3,
              solution: "Riesgos: perdida de datos (alto impacto, media probabilidad), downtime (alto, baja). Mitigacion: backups, ventanas de mantenimiento."
            },
            {
              topic: "MS Project",
              question: "Crear un cronograma en MS Project para un proyecto de desarrollo web de 3 meses.",
              difficulty: 2,
              solution: "Definir tareas: Analisis(2sem), Diseno(1sem), Desarrollo(6sem), Testing(2sem), Despliegue(1sem). Asignar recursos y dependencias."
            }
          ],
          topics: [
            { id: "sgest-1", subjectId: "sgest", name: "Sistemas de información gerencial", description: "EIS, DSS, BI, dashboards, toma de decisiones", difficulty: 2, estimatedMinutes: 180 },
            { id: "sgest-2", subjectId: "sgest", name: "ERP: conceptos y arquitectura", description: "Módulos, integración, SAP, Oracle, Microsoft", difficulty: 3, estimatedMinutes: 220 },
            { id: "sgest-3", subjectId: "sgest", name: "Módulos de ERP", description: "Finanzas, RRHH, logística, producción", difficulty: 3, estimatedMinutes: 200 },
            { id: "sgest-4", subjectId: "sgest", name: "CRM", description: "Clientes, ventas, marketing, servicio", difficulty: 3, estimatedMinutes: 180 },
            { id: "sgest-5", subjectId: "sgest", name: "SCM", description: "Cadena de suministro, logística, inventarios", difficulty: 3, estimatedMinutes: 180 },
            { id: "sgest-6", subjectId: "sgest", name: "Business Intelligence", description: "ETL, data warehousing, OLAP, dashboards", difficulty: 3, estimatedMinutes: 200 },
            { id: "sgest-7", subjectId: "sgest", name: "Integración de sistemas", description: "Middlewares, APIs, ESB, patrones", difficulty: 4, estimatedMinutes: 200 },
            { id: "sgest-8", subjectId: "sgest", name: "Gestión del conocimiento", description: "Bases de conocimiento, wiki, comunidades", difficulty: 2, estimatedMinutes: 140 },
            { id: "sgest-9", subjectId: "sgest", name: "Transformación digital", description: "Estrategia, automatización, AI, cambio cultural", difficulty: 3, estimatedMinutes: 180 },
            { id: "sgest-10", subjectId: "sgest", name: "Gobierno de TI: COBIT", description: "Marco COBIT, alineación, riesgos, métricas", difficulty: 3, estimatedMinutes: 160 },
            { id: "sgest-11", subjectId: "sgest", name: "Gestión de proyectos de implementación", description: "Fases, change management, piloto, go-live", difficulty: 3, estimatedMinutes: 160 },
          ],
        },
        {
          id: "gger",
          name: "Gestión Gerencial",
          code: "ISI-504",
          level: 5,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Planificación estratégica, liderazgo y control de gestión para organizaciones tecnológicas.",
          category: "general" as SubjectCategory,
          difficulty: 2,
          studyHoursPerWeek: 5,
          keyConcepts: ["Planificación estratégica", "Liderazgo", "Control de gestión", "Toma de decisiones", "Gestión del cambio", "Emprendimiento"],
          prerequisites: ["eco"],
          bibliography: {
            official: [
              "Kaplan, R. & Norton, D. The Balanced Scorecard. Harvard Business School Press.",
              "Drucker, P. Management Challenges for the 21st Century. Harper Business.",
              "Porter, M. Competitive Strategy. Free Press."
            ],
            complementary: [
              "Christensen, C. The Innovator's Dilemma. Harvard Business Review Press.",
              "Collins, J. Good to Great. Harper Business."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre gestion gerencial, liderazgo, toma de decisiones y direccion estrategica.",
            practice: "Analisis de casos empresariales, simulaciones de gerencia, trabajo en equipo.",
            activities: [
              "Analisis de casos de gerencia",
              "Simulaciones de toma de decisiones",
              "Debates sobre liderazgo",
              "Trabajos Practicos de gestion",
              "Presentaciones de estrategias"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con analisis de casos de gerencia.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos y participacion (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los principios de la gestion gerencial.",
            "Desarrollar habilidades de liderazgo y toma de decisiones.",
            "Aplicar herramientas de gestion estrategica.",
            "Evaluar el desempeno organizacional."
          ],
          competencies: [
            "Aplicar herramientas de gestion estrategica.",
            "Liderar equipos de trabajo efectivamente.",
            "Tomar decisiones basadas en datos.",
            "Evaluar el rendimiento organizacional con KPIs."
          ],
          partialExamples: [
            {
              topic: "Liderazgo",
              question: "Comparar estilos de liderazgo: autoritario, democratico y laissez-faire.",
              difficulty: 2,
              solution: "Autoritario: control total, util en crisis. Democratico: participacion, mayor compromiso. Laissez-faire: autonomia, riesgo de desorden."
            },
            {
              topic: "Estrategia",
              question: "Aplicar las 5 fuerzas de Porter a una startup de software.",
              difficulty: 3,
              solution: "Amenaza de nuevos entrantes: alta. Poder de proveedores: bajo (cloud). Poder de clientes: medio. Sustitutos: medios. Rivalidad: alta."
            }
          ],
          topics: [
            { id: "gger-1", subjectId: "gger", name: "Conceptos de gestión", description: "Funciones, roles, habilidades directivas", difficulty: 1, estimatedMinutes: 120 },
            { id: "gger-2", subjectId: "gger", name: "Planificación estratégica", description: "Misión, visión, valores, cascada estratégica", difficulty: 2, estimatedMinutes: 180 },
            { id: "gger-3", subjectId: "gger", name: "Análisis FODA", description: "Fortalezas, oportunidades, debilidades, amenazas", difficulty: 2, estimatedMinutes: 140 },
            { id: "gger-4", subjectId: "gger", name: "Estructura organizacional", description: "Funcional, proyectos, matricial, flat", difficulty: 2, estimatedMinutes: 140 },
            { id: "gger-5", subjectId: "gger", name: "Dirección y liderazgo", description: "Estilos, motivación, comunicación, equipos", difficulty: 2, estimatedMinutes: 180 },
            { id: "gger-6", subjectId: "gger", name: "Control de gestión: BSC", description: "Balanced Scorecard, perspectivas, KPIs", difficulty: 3, estimatedMinutes: 180 },
            { id: "gger-7", subjectId: "gger", name: "Presupuestos", description: "Maestro, actividades, costos, forecast", difficulty: 3, estimatedMinutes: 160 },
            { id: "gger-8", subjectId: "gger", name: "Gestión del cambio", description: "Modelos, resistencia, cultura organizacional", difficulty: 2, estimatedMinutes: 140 },
            { id: "gger-9", subjectId: "gger", name: "Negociación", description: "Técnicas, win-win, BATNA, mediación", difficulty: 2, estimatedMinutes: 140 },
            { id: "gger-10", subjectId: "gger", name: "Toma de decisiones", description: "Modelos, árboles, multicriterio, sesgos", difficulty: 2, estimatedMinutes: 140 },
            { id: "gger-11", subjectId: "gger", name: "Emprendimiento", description: "Canvas, lean startup, pitch, escalabilidad", difficulty: 2, estimatedMinutes: 160 },
          ],
        },
        {
          id: "ssi",
          name: "Seguridad en los Sistemas de Información",
          code: "ISI-505",
          level: 5,
          career: "Ingeniería en Sistemas de Información",
          credits: 3,
          hoursPerWeek: 3,
          totalHours: 72,
          recoveryNote: 6,
          description: "Criptografía, controles de acceso, seguridad de redes, auditoría y gestión de incidentes.",
          category: "cs" as SubjectCategory,
          difficulty: 4,
          studyHoursPerWeek: 6,
          keyConcepts: ["Criptografía", "Control de acceso", "Seguridad de redes", "OWASP", "Auditoría", "Gestión de incidentes", "Normativa"],
          prerequisites: ["rd"],
          bibliography: {
            official: [
              "Stallings, W. Network Security Essentials. 6a edicion. Pearson.",
              "Pfleeger, C. Security in Computing. 5a edicion. Prentice Hall.",
              "Anderson, R. Security Engineering. 2a edicion. Wiley."
            ],
            complementary: [
              "Schneier, B. Applied Cryptography. 2a edicion. Wiley.",
              "OWASP. Web Security Top 10."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre seguridad informatica, criptografia, redes seguras y auditoria de seguridad.",
            practice: "Laboratorio con herramientas de seguridad (Kali Linux), pruebas de penetracion, analisis de vulnerabilidades.",
            activities: [
              "Analisis de vulnerabilidades con Nmap/Nessus",
              "Pruebas de penetracion con Metasploit",
              "Configuracion de firewalls e IDS",
              "Trabajos Practicos de seguridad",
              "Auditorias de seguridad"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Examen final con ejercicios de seguridad y auditoria.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales (cada uno 40% de la nota de cursada)",
              "Trabajos Practicos de laboratorio (20%)",
              "Examen final (100% de la nota final)"
            ]
          },
          objectives: [
            "Comprender los fundamentos de seguridad informatica.",
            "Implementar mecanismos de autenticacion y autorizacion.",
            "Aplicar criptografia para proteger datos.",
            "Realizar auditorias de seguridad de sistemas."
          ],
          competencies: [
            "Identificar y mitigar vulnerabilidades de seguridad.",
            "Implementar sistemas de autenticacion seguros.",
            "Configurar firewalls y sistemas de deteccion de intrusos.",
            "Realizar pruebas de penetracion basicas."
          ],
          partialExamples: [
            {
              topic: "Criptografia",
              question: "Explicar la diferencia entre cifrado simetrico y asimetrico. Cuando usar cada uno?",
              difficulty: 2,
              solution: "Simetrico (AES): rapido, misma clave para cifrar/descifrar. Asimetrico (RSA): lento, usa par de claves publica/privada. Usar asimetrico para intercambiar clave simetrica."
            },
            {
              topic: "SQL Injection",
              question: "Como prevenir ataques de SQL Injection en una aplicacion web?",
              difficulty: 3,
              solution: "Usar consultas parametrizadas/prepared statements, validacion de entradas, minimo privilegio en BD, WAF."
            }
          ],
          topics: [
            { id: "ssi-1", subjectId: "ssi", name: "Conceptos de seguridad", description: "CIA, amenazas, vulnerabilidades, riesgos, NIST", difficulty: 2, estimatedMinutes: 180 },
            { id: "ssi-2", subjectId: "ssi", name: "Criptografía simétrica y asimétrica", description: "AES, DES, RSA, ECC, intercambio de claves", difficulty: 4, estimatedMinutes: 280 },
            { id: "ssi-3", subjectId: "ssi", name: "Funciones hash y firmas digitales", description: "SHA, HMAC, firmas, integridad", difficulty: 3, estimatedMinutes: 180 },
            { id: "ssi-4", subjectId: "ssi", name: "PKI", description: "Infraestructura de claves, X.509, CA, revocación", difficulty: 4, estimatedMinutes: 200 },
            { id: "ssi-5", subjectId: "ssi", name: "Autenticación", description: "Passwords, MFA, biometría, OAuth, SAML, JWT", difficulty: 3, estimatedMinutes: 200 },
            { id: "ssi-6", subjectId: "ssi", name: "Controles de acceso", description: "DAC, MAC, RBAC, ABAC, least privilege", difficulty: 3, estimatedMinutes: 180 },
            { id: "ssi-7", subjectId: "ssi", name: "Seguridad de SO", description: "Hardening, actualizaciones, logging", difficulty: 3, estimatedMinutes: 160 },
            { id: "ssi-8", subjectId: "ssi", name: "OWASP Top 10", description: "Inyección, XSS, broken auth, deserialization", difficulty: 4, estimatedMinutes: 240 },
            { id: "ssi-9", subjectId: "ssi", name: "Seguridad de redes: IDS/IPS", description: "Detección, prevención, firmas, anomalías", difficulty: 4, estimatedMinutes: 180 },
            { id: "ssi-10", subjectId: "ssi", name: "Ingeniería social", description: "Phishing, pretexting, vishing, contramedidas", difficulty: 3, estimatedMinutes: 140 },
            { id: "ssi-11", subjectId: "ssi", name: "Auditoría de seguridad", description: "Metodologías, pentesting, reportes", difficulty: 4, estimatedMinutes: 200 },
            { id: "ssi-12", subjectId: "ssi", name: "Gestión de incidentes", description: "Clasificación, respuesta, forense, lecciones", difficulty: 4, estimatedMinutes: 200 },
            { id: "ssi-13", subjectId: "ssi", name: "ISO 27001 y GDPR", description: "ISMS, controles, cumplimiento, datos", difficulty: 3, estimatedMinutes: 180 },
            { id: "ssi-14", subjectId: "ssi", name: "Continuidad del negocio", description: "BCP, DRP, RTO, RPO, sites, testing", difficulty: 3, estimatedMinutes: 160 },
          ],
        },
        {
          id: "pf",
          name: "Proyecto Final - Integradora",
          code: "ISI-506",
          level: 5,
          career: "Ingeniería en Sistemas de Información",
          credits: 6,
          hoursPerWeek: 6,
          totalHours: 144,
          recoveryNote: 15,
          description: "Proyecto de ingeniería integrador aplicando conocimientos de toda la carrera.",
          category: "engineering" as SubjectCategory,
          difficulty: 5,
          studyHoursPerWeek: 15,
          keyConcepts: ["Gestión de proyectos", "Integración de conocimientos", "Resolución de problemas reales", "Comunicación técnica", "Documentación profesional"],
          prerequisites: ["asiadm", "isw", "ia", "cdatos", "sgest", "gger", "ssi"],
          bibliography: {
            official: [
              "Pressman, R. Software Engineering: A Practitioner's Approach. 9a edicion. McGraw-Hill.",
              "Sommerville, I. Software Engineering. 10a edicion. Pearson.",
              "ISO/IEC/IEEE 29148 - Software Life Cycle Processes."
            ],
            complementary: [
              "Fowler, M. UML Distilled. 3a edicion. Addison-Wesley.",
              "Martin, R. Clean Code. Prentice Hall.",
              "Beck, K. Test Driven Development. Addison-Wesley."
            ]
          },
          methodology: {
            theory: "Clase teorica sobre metodologia de proyecto final, planificacion, ejecucion y presentacion.",
            practice: "Desarrollo del proyecto final integrador con asesoramiento, reuniones de seguimiento.",
            activities: [
              "Definicion del proyecto y alcance",
              "Desarrollo iterativo con reuniones de avance",
              "Documentacion y presentaciones",
              "Revision de codigo y testing",
              "Presentacion final ante jurado"
            ]
          },
          evaluation: {
            regularity: "Aprobar como minimo 2 parciales con nota >= 4. Asistencia regular obligatoria (80% minimo).",
            promotion: "Presentacion del proyecto final ante jurado. La nota depende de la calidad del proyecto, documentacion y presentacion.",
            recovery: "Recuperatorio en el primer semestre del ano siguiente.",
            criteria: [
              "2 Parciales o informes de avance (cada uno 40% de la nota de cursada)",
              "Documentacion del proyecto (20%)",
              "Presentacion final ante jurado (100% de la nota final)"
            ]
          },
          objectives: [
            "Integrar los conocimientos adquiridos en la carrera en un proyecto real.",
            "Aplicar metodologias de ingenieria de software en la practica.",
            "Desarrollar habilidades de trabajo en equipo y comunicacion.",
            "Presentar y defender un proyecto ante un jurado."
          ],
          competencies: [
            "Planificar y ejecutar un proyecto de ingenieria de software completo.",
            "Documentar un proyecto segun estandares de la industria.",
            "Presentar resultados tecnicos a audiencias no tecnicas.",
            "Integrar conocimientos de multiples disciplinas."
          ],
          partialExamples: [
            {
              topic: "Documentacion",
              question: "Elaborar un documento de especificacion de requisitos (SRS) para el proyecto final.",
              difficulty: 3,
              solution: "Incluir: introduccion, descripcion del sistema, requisitos funcionales, no funcionales, restricciones, criterios de aceptacion, plan de verificacion."
            },
            {
              topic: "Presentacion",
              question: "Preparar una presentacion de 20 minutos para defender el proyecto final.",
              difficulty: 2,
              solution: "Estructura: Problema -> Solucion -> Tecnologias -> Demo -> Resultados -> Conclusiones. Maximo 20 slides, incluir demo en vivo."
            }
          ],
          topics: [
            { id: "pf-1", subjectId: "pf", name: "Definición del problema y alcance", description: "Problemática, objetivos, stakeholders", difficulty: 3, estimatedMinutes: 200 },
            { id: "pf-2", subjectId: "pf", name: "Estudio de factibilidad", description: "Técnica, económica, operativa, costo-beneficio", difficulty: 3, estimatedMinutes: 180 },
            { id: "pf-3", subjectId: "pf", name: "Plan de proyecto", description: "WBS, cronograma, recursos, riesgos, presupuesto", difficulty: 3, estimatedMinutes: 200 },
            { id: "pf-4", subjectId: "pf", name: "Análisis de requerimientos", description: "Elicitación, documentación, trazabilidad", difficulty: 3, estimatedMinutes: 180 },
            { id: "pf-5", subjectId: "pf", name: "Diseño del SI", description: "Arquitectura, diseño detallado, prototipos", difficulty: 4, estimatedMinutes: 300 },
            { id: "pf-6", subjectId: "pf", name: "Implementación y desarrollo", description: "Codificación, control de versiones, CI/CD", difficulty: 4, estimatedMinutes: 400 },
            { id: "pf-7", subjectId: "pf", name: "Pruebas y validación", description: "Plan de pruebas, ejecución, validación con usuario", difficulty: 4, estimatedMinutes: 280 },
            { id: "pf-8", subjectId: "pf", name: "Documentación técnica", description: "Memoria técnica, manual de usuario, API docs", difficulty: 3, estimatedMinutes: 200 },
            { id: "pf-9", subjectId: "pf", name: "Presentación y defensa", description: "Presentación oral, defensa ante jurado, evaluación", difficulty: 3, estimatedMinutes: 200 },
            { id: "pf-10", subjectId: "pf", name: "Integración de conocimientos", description: "Aplicación transversal de conocimientos de la carrera", difficulty: 4, estimatedMinutes: 240 },
            { id: "pf-11", subjectId: "pf", name: "Aspectos éticos e impacto social", description: "Ética profesional, impacto, sustentabilidad", difficulty: 2, estimatedMinutes: 120 },
          ],
        },
      ],
    },
  ],
};

export function getAllSubjects(): Subject[] {
  return CURRICULUM.levels.flatMap((level) => level.subjects);
}

export function getSubjectsByLevel(level: number): Subject[] {
  return CURRICULUM.levels.find((l) => l.level === level)?.subjects ?? [];
}

export function getSubjectById(id: string): Subject | undefined {
  return getAllSubjects().find((s) => s.id === id);
}

export function getSubjectsByCategory(category: SubjectCategory): Subject[] {
  return getAllSubjects().filter((s) => s.category === category);
}

export function getSubjectsWithPrerequisite(subjectId: string): Subject[] {
  return getAllSubjects().filter((s) => s.prerequisites.includes(subjectId));
}

export const CATEGORY_LABELS: Record<SubjectCategory, string> = {
  math: "Matemática",
  physics: "Física",
  cs: "Ciencias de la Computación",
  engineering: "Ingeniería",
  general: "General",
};

export const CATEGORY_COLORS: Record<SubjectCategory, string> = {
  math: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  physics: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  cs: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  engineering: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  general: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};