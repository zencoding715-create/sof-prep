// Career-specific conditioning context, not official standards or training prescriptions.
// Verify current eligibility, test protocol, and officer/enlisted differences with the service.
const CONFIRM_OFFICER = 'Officer eligibility, corresponding role, and current testing must be confirmed with the service; do not assume enlisted cutoffs apply.';
const profile = (name, trainingPriorities, preparationContext, source, officerContext = CONFIRM_OFFICER) => Object.freeze({
  name,
  trainingPriorities: Object.freeze(trainingPriorities),
  preparationContext,
  source,
  officerContext,
});

export const PATHWAY_PROFILES = Object.freeze({
  navy: profile('Navy SEAL', [
    'Develop the selected screening swim, run, and calisthenics together; prioritize the weakest recorded event.',
    'Build aerobic and strength endurance gradually; surface-swim work depends on safe pool access and readiness.',
  ], 'The maritime selection pipeline and current screening details should be confirmed with Navy recruiting.', 'https://www.navy.com/careers-benefits/careers/special-operations/navy-seal'),
  swcc: profile('Navy SWCC', [
    'Develop surface swimming, running, and the applicable screening calisthenics without neglecting a weaker event.',
    'Build repeatable upper-body and trunk strength endurance and aerobic recovery gradually for the maritime setting.',
  ], 'SWCC is a combat-craft community; confirm the current screening and accession process with Navy recruiting.', 'https://www.navy.com/careers-benefits/careers/special-operations/special-warfare-combat-crewman', 'SWCC is an enlisted operator rating; ask Navy recruiting about officer communities and their separate requirements.'),
  eod: profile('Navy Explosive Ordnance Disposal (EOD)', [
    'Balance screening surface swimming, running, and calisthenics against the candidate’s recorded strengths and gaps.',
    'Develop general strength and aerobic endurance without treating dive-specific skills as solo conditioning.',
  ], 'EOD also involves technical learning and medically qualified dive training; confirm the selected track and requirements with Navy recruiting.', 'https://www.navy.com/careers-benefits/careers/special-operations/explosive-ordnance-disposal-technician'),
  diver: profile('Navy Diver', [
    'Develop efficient surface swimming alongside screening running and upper-body strength endurance.',
    'Use ordinary supervised pool sessions when available; do not prescribe diving, breath-holds, or submerged drills.',
  ], 'Diver training includes technical diving and medical qualification; confirm the current pathway and testing with Navy recruiting.', 'https://www.navy.com/careers-benefits/careers/special-operations/navy-diver'),
  airr: profile('Navy Aviation Rescue Swimmer (AIRR)', [
    'Prioritize efficient surface freestyle and aerobic swim endurance when safe pool access is available.',
    'Maintain screening-specific running, pushing, pulling, and trunk strength while progressing recovery-aware.',
  ], 'AIRR combines aviation, water survival, and rescue skills; obtain skill instruction through qualified personnel.', 'https://www.navy.com/careers-benefits/careers/special-operations/aircrew-rescue-swimmer', 'AIRR is an enlisted aircrew route; ask Navy recruiting about distinct officer aviation and rescue roles.'),
  'hm-atf': profile('Navy Hospital Corpsman ATF / SOIDC', [
    'Build screening-relevant surface swimming, running, and calisthenics as a balanced program.',
    'Adapt general strength and aerobic work to the user’s baseline while keeping swim skill work supervised.',
  ], 'The medical training and exact HM-ATF track differ; verify SOIDC or the chosen track with Navy recruiting.', 'https://www.navy.com/careers-benefits/careers/special-operations'),
  pj: profile('Air Force Pararescue (PJ)', [
    'Prepare for relevant run, calisthenics, and surface-swim events while respecting pool access.',
    'Build general strength and aerobic endurance; only add load carriage gradually if the user’s readiness supports it.',
  ], 'Pararescue combines personnel recovery with medical training; official water-confidence testing belongs in qualified programs.', 'https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/pararescue', 'Combat Rescue Officer is a separate officer career; confirm the applicable officer selection and test protocol.'),
  cct: profile('Air Force Combat Control (CCT)', [
    'Build the applicable running, calisthenics, and surface-swimming base for the selected entry route.',
    'Improve general strength and durable aerobic fitness without prescribing technical military tasks as workouts.',
  ], 'Combat Control includes air traffic control and communications training beyond physical preparation.', 'https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/combat-control', 'Special Tactics Officer is a separate officer career; confirm the applicable officer selection and test protocol.'),
  tacp: profile('Air Force Tactical Air Control Party (TACP)', [
    'Emphasize durable running and strength endurance for the applicable route and user’s starting fitness.',
    'Add swimming only when relevant to the confirmed testing or user’s goals, with safe access; build load tolerance only if appropriate.',
  ], 'TACP and TACP Officer are distinct service careers; verify the route’s current screening and field training.', 'https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/tactical-air-control-party-specialist-tacp', 'The Air Force lists TACP Officer separately; confirm its current officer testing rather than using enlisted cutoffs.'),
  sr: profile('Air Force Special Reconnaissance (SR)', [
    'Prepare balanced run, calisthenics, and surface-swimming fitness where applicable and safely accessible.',
    'Build aerobic durability and general strength progressively; avoid assuming a specific load standard.',
  ], 'SR combines reconnaissance and technical learning; verify the specialty and entry route with an Air Force recruiter.', 'https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/special-reconnaissance'),
  sf: profile('Army Special Forces / Green Beret', [
    'Build durable aerobic running and general strength for the user’s baseline and available preparation time.',
    'Develop walking and loaded-march tolerance only when appropriate and progressively, without assigning an unverified target.',
  ], 'Special Forces assessment and entry rules depend on service status and route; confirm current guidance with Army recruiting.', 'https://www.goarmy.com/careers-and-jobs/specialty-careers/special-ops/special-forces'),
  ranger: profile('75th Ranger Regiment', [
    'Prioritize the applicable longer run and calisthenics while preserving a sustainable aerobic base.',
    'Build progressive load-carriage tolerance only when readiness supports it; separate hard running and loaded marching.',
  ], 'RASP and Ranger School are distinct; confirm the user’s selection process and current test protocol.', 'https://www.goarmy.com/careers-and-jobs/specialty-careers/special-ops/army-rangers', 'Army describes a separate RASP 2 route for eligible officers; confirm officer-specific requirements and do not assume enlisted cutoffs.'),
  psyop: profile('Army Psychological Operations (PSYOP)', [
    'Build a sustainable running and general strength foundation for current service fitness demands.',
    'Use the user’s actual scores and baseline rather than imposing another specialty’s swim or ruck regimen.',
  ], 'PSYOP training also emphasizes communication, cultural knowledge, and language; accession requirements differ by status.', 'https://www.goarmy.com/careers-and-jobs/specialty-careers/special-ops/psychological-operations'),
  ca: profile('Army Civil Affairs (CA)', [
    'Build running, general strength, and work capacity for the user’s current fitness and service route.',
    'If field load preparation is relevant and appropriate, introduce it gradually instead of imposing a fixed ruck benchmark.',
  ], 'Civil Affairs includes civil engagement, judgment, and cultural learning; eligibility varies across component and entry route.', 'https://www.goarmy.com/careers-and-jobs/specialty-careers/special-ops/civil-affairs'),
  soar: profile('160th SOAR / Night Stalkers', [
    'Develop general aerobic fitness, strength, and the user’s applicable service fitness events.',
    'Avoid assigning a generic operator-specific swimming or rucking program without a confirmed role requirement.',
  ], 'SOAR is an aviation regiment with varied technical positions and service requirements; confirm the specific aviation role.', 'https://www.goarmy.com/careers-and-jobs/specialty-careers/special-ops'),
  raider: profile('Marine Raider / MARSOC', [
    'Build running, Marine fitness-test components, strength endurance, and surface swim proficiency when safely accessible.',
    'Progress overall work capacity carefully and avoid assuming that a single score represents selection readiness.',
  ], 'MARSOC selection is distinct from Marine Recon and has its own service and assessment prerequisites.', 'https://www.marines.com/about-the-marine-corps/roles/special-operations.html'),
  recon: profile('Marine Reconnaissance', [
    'Build the user’s running, calisthenics, and surface-swimming foundations according to their baseline and access.',
    'Include general strength endurance and measured recovery while training toward the applicable Marine fitness events.',
  ], 'Marine Recon is a separate pathway from MARSOC; confirm the current accession and screening process.', 'https://www.marines.com/about-the-marine-corps/roles.html'),
  'coast-ast': profile('Coast Guard Aviation Survival Technician (AST) · Rescue Swimmer', [
    'Prioritize safe surface-swim technique and endurance alongside running or shuttle fitness and upper-body endurance.',
    'Use the user’s equipment and swimming access; reserve gear-swim and official water evaluation skills for qualified supervision.',
  ], 'AST combines rescue swimming, aviation survival skills, and emergency medical training; verify the current preparation and school requirements.', 'https://www.gocoastguard.com/careers/enlisted/ast', 'AST is an enlisted rating; ask a Coast Guard recruiter about separate officer aviation and rescue pathways.'),
  sere: profile('Air Force SERE Specialist', [
    'Emphasize applicable running and calisthenics events with gradual general strength and aerobic development.',
    'Build field durability progressively and develop surface-swimming confidence when safely accessible.',
  ], 'SERE training includes survival instruction and learning; confirm the current route and testing with the Air Force.', 'https://www.airforce.com/careers/special-warfare-and-combat-support/survival-evasion-resistance-and-escape-sere'),
  'af-eod': profile('Air Force Explosive Ordnance Disposal (EOD)', [
    'Develop the user’s recorded running and calisthenic baselines without inventing EOD-specific fitness cutoffs.',
    'Use progressive full-body strength, mobility, and recovery to support general physical readiness.',
  ], 'Air Force EOD is a technical combat-support specialty distinct from Navy EOD; verify current screening and role requirements.', 'https://www.airforce.com/careers/special-warfare-and-combat-support/explosive-ordnance-disposal-eod'),
});
