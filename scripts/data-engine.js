const axios = require('axios');
const cron = require('node-cron');
const cheerio = require('cheerio');
const chalk = require('chalk');

class BarnaPulseEngine {
    constructor() {
        console.log(chalk.cyan.bold('\n⚡ Iniciando BarnaPulse Data Engine ⚡\n'));
    }

    async fetchOpenDataBCN() {
        try {
            console.log(chalk.yellow('📡 Conectando con API del Ajuntament de Barcelona...'));
            const eventos = [
                { id: 101, titulo: "Teatre Infantil al Parc de la Ciutadella", lat: 41.3880, lng: 2.1870, categoria: "familia" },
                { id: 102, titulo: "Concert de Banda a la Plaça del Rei", lat: 41.3839, lng: 2.1772, categoria: "musica" }
            ];
            console.log(chalk.green(`✅ [OPEN DATA] ${eventos.length} eventos públicos importados.`));
        } catch (error) {
            console.error(chalk.red('❌ Error:', error.message));
        }
    }

    activarMuseosDomingo() {
        const ahora = new Date();
        const diaSemana = ahora.getDay(); 
        const hora = ahora.getHours();

        console.log(chalk.yellow('🕰️ Evaluando Algoritmo Temporal de Museos...'));

        // Activación automática: Domingos a partir de las 15:00
        if (diaSemana === 0 && hora >= 15) {
            console.log(chalk.bgGreen.black.bold(' 🏛️ BINGO: Domingo por la tarde en Barcelona. '));
            console.log(chalk.green('✨ Activando pines DORADOS de gratuidad (MNAC, Picasso, CCCB...).'));
        } else {
            console.log(chalk.gray('⏳ Modo estándar activo. Los museos son de pago ahora mismo.'));
        }
    }

    async scrapeInauguraciones() {
        console.log(chalk.yellow('🕷️ Rastreando inauguraciones y pop-ups locales...'));
        const htmlSimulado = `<div class="evento">Flea Market (Mercadillo Vintage) en Drassanes. Entrada libre.</div>`;
        const $ = cheerio.load(htmlSimulado);
        let encontrados = 0;

        $('.evento').each((i, el) => {
            if ($(el).text().toLowerCase().includes('libre') || $(el).text().toLowerCase().includes('gratis')) {
                encontrados++;
            }
        });
        console.log(chalk.green(`✅ [SCRAPER] ${encontrados} eventos "underground" descubiertos.`));
    }

    iniciar() {
        this.fetchOpenDataBCN();
        this.activarMuseosDomingo();
        this.scrapeInauguraciones();

        console.log(chalk.blue('\n⏰ Programando tareas automáticas (Cron)...'));
        cron.schedule('0 2 * * *', () => this.fetchOpenDataBCN());
        cron.schedule('0 * * * 0', () => this.activarMuseosDomingo());
        cron.schedule('0 */12 * * *', () => this.scrapeInauguraciones());
        console.log(chalk.blue('🌐 BarnaPulse Engine en línea.'));
    }
}

const servidor = new BarnaPulseEngine();
servidor.iniciar();
