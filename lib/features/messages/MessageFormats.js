module.exports = {
    nameShort: 'ROT*NIVÅ',

    header: ['101','018','102','018','022'],

    '0': {
        nameShort: 'RADIOFMT',
        '0': {
            nameShort: 'RADIOFMT',
            '0': { nameLong: 'RADIOFORMAT*',     nameShort: 'RADIOFMT' }
        }
    },
    '1': {
        nameShort: 'LEDNING',
        '0': {
            nameShort: 'LEDNSBTJ',
            '0': { nameLong: 'FRI*TEXT*',        nameShort: 'FRI*TEXT', body: ['104','018','018','018','018','018','018','018','018','018','018'] },
            '1': { nameLong: 'PASSNINGSALT*',    nameShort: 'PASS*ALT', body: ['624','824','624','824','624','824','624','824','624','824'] },
            '2': { nameLong: 'RADIONYCKEL*KRY*', nameShort: 'RANY*KRY', body: ['104','018','018','018','018','018','018','018','018','018','018']},
            '3': { nameLong: 'FÖRBINDELSEPROV*', nameShort: 'FÖRBPROV', body: ['394'] },
            '4': { nameLong: 'KVITTENS*',        nameShort: 'KVITTENS', body: ['909','018','018'] },
            '5': { nameLong: 'REPETERA*',        nameShort: 'REPETERA', body: ['910'] },
        },
        '1': {
            nameShort: 'LEDNRAPP',
            '0': { nameLong: 'STABSPLATS*RAPP*', nameShort: 'STABRAPP' },
            '1': { nameLong: 'TROSS/UH-PLATSER', nameShort: 'TROSSRAP' },
            '2': { nameLong: 'MINERINGSRAPP*',   nameShort: 'MINRAPP' },
            '3': { nameLong: 'STRIVRAPP:10-64',  nameShort: 'STRVRAPP' },
            '4': { nameLong: 'STRIVRAPP:70-120', nameShort: 'STRVRAPP' }
        }
    },
    '2': {
        nameShort: 'LV',
        '0': {
            nameShort: 'LV-LEDN',
            '0': { nameLong: 'ORDER*INFLYGNING', nameShort: 'ORDINFLY' },
            '1': { nameLong: 'ORDLUFTFARKOST*1', nameShort: 'ORDLUFT1' },
            '2': { nameLong: 'ORDLUFTFARKOST*2', nameShort: 'ORDLUFT2' },
            '3': { nameLong: 'ORDLUFTLANDSÄTTN', nameShort: 'ORDER*LL' },
            '4': { nameLong: 'ORD*UNDERSTÖDJER', nameShort: 'ORD*USTD' },
            '5': { nameLong: 'ORDER*SKYDDAR*',   nameShort: 'ORD*SKYD' },
            '6': { nameLong: 'LUFOR/LV-ORDER',   nameShort: 'LUFOR*LV' },
            '7': { nameLong: 'RPK*ORIGO*ALT*',   nameShort: 'ORIGO' },
            '8': { nameLong: 'FLYGBASSAMBERKAN', nameShort: 'FLBASSV1' },
            '9': { nameLong: 'FLYGRÄNNA*',       nameShort: 'FLBASSV2' },
        },
        '1': {
            nameShort: 'LV-RAPP',
            '0': { nameLong: 'GRUPPERINGSRAPP*', nameShort: 'GRPRAPP' },
            '1': { nameLong: 'HÖRBARHETLUF/LVO', nameShort: 'HÖRBLUF' },
            '2': { nameLong: 'AFLYGVÄDERPROGN*', nameShort: 'AF*VÄDEP' }
        }
    },
    '3': {
        nameShort: 'SJÖMÅL',
        '0': {
            nameShort: 'ETI',
            '0': { nameLong: 'ETI*SVAR',         nameShort: 'ETI*SVAR' },
        },
        '1': {
            nameShort: 'ELDORDER',
            '0': { nameLong: 'ELDORDER/ETI*',    nameShort: 'EO*ETI' },
            '1': { nameLong: 'ELDORDER*KNS*',    nameShort: 'EO*KNS' },
            '2': { nameLong: 'ELDORDER*SJÖMÅL1', nameShort: 'EO*SJM*1' }
        },
        '2': {
            nameShort: 'ELDSIGN',
            '0': { nameLong: 'ERO*NORMALMETOD1', nameShort: 'ERO*N1' },
            '1': { nameLong: 'ERO*NORMALMETOD2', nameShort: 'ERO*N2' },
            '2': { nameLong: 'VERKANSRAPPORT*',  nameShort: 'VERKRAPP' },
            '3': { nameLong: 'ERO*MFU*ESU*',     nameShort: 'ERO*ESU' },
            '4': { nameLong: 'PJÄSCHEFSRAPPORT', nameShort: 'PJCHRAPP' },
            '5': { nameLong: 'ERO*NYTT*ELDK*',   nameShort: 'ERO*NYTT' },
            '6': { nameLong: 'ERO*NYA-BERLEM*',  nameShort: 'ERO*NYBE' },
            '7': { nameLong: 'ERO*KNS*',         nameShort: 'ERO*KNS' },
            '8': { nameLong: 'ERO*KORREKTIONER', nameShort: 'ERO*KORR' },
            '9': { nameLong: 'ERO*SJÖMÅL*',      nameShort: 'ERO*SJÖM' }
        },
        '3': {
            nameShort: 'ELDSIGN',
            '0': { nameLong: 'ME*SJÖMÅL*',       nameShort: 'ME*SJÖ' },
            '1': { nameLong: 'ME*MARKMÅL*',      nameShort: 'ME*MARK' }
        },
        '4': {
            nameShort: 'REK',
            '0': { nameLong: 'REKORDER*',        nameShort: 'REKORDER' },
            '1': { nameLong: 'REKRAPPORT*',      nameShort: 'REKRAPP' }
        },
        '5': {
            nameShort: 'GRPNG',
            '0': { nameLong: 'GRPORDER*MST*',    nameShort: 'GRP*MST' },
            '1': { nameLong: 'GRUPPERINGSO*01*', nameShort: 'GRP*01' },
            '2': { nameLong: 'GRUPPERINGSO*02*', nameShort: 'GRP*02' }
        },
        '6': {
            nameShort: 'FÄLLRAPP',
            '0': { nameLong: 'FÄLLNINGSRAPP',    nameShort: 'FÄLLRAPP' }
        },
        '7': {
            nameShort: 'SPANRAPP',
            '0': { nameLong: 'SPANINGSORDER*KA', nameShort: 'S-ORD*KA' },
            '1': { nameLong: 'IK*TABLÅ*',        nameShort: 'IK*TABLÅ' },
            '2': { nameLong: 'MÅLRAPPORT*1*KA*', nameShort: 'MÅLRAPP1' },
            '3': { nameLong: 'MÅLRAPPORT*2*KA*', nameShort: 'MÅLRAPP2' }
        },
        '8': {
            nameShort: 'BER',
            '0': { nameLong: 'BEREDSKAPSTABLÅ*', nameShort: 'BERTAB' },
            '1': { nameLong: 'RAPP*INT*BER*',        nameShort: 'RAPP*INT' }
        },
        '9': {
            nameShort: 'TABLÅER',
            '0': { nameLong: 'AKTUALITETSTABLÅ', nameShort: 'AKTUALIT' }
        }
    },
    '4': {
        nameShort: 'U-STÖD',
        '0': {
            nameShort: 'ETI',
            '0': { nameLong: 'ETI*BEGÄRAN*',     nameShort: 'ETI*BEGÄ' },
            '1': { nameLong: 'ETI*TILLDELNING*', nameShort: 'ETI*TILL' },
            '2': { nameLong: 'ETI*ÅTERLÄMNANDE', nameShort: 'ETI*ÅTLÄ' },
            '3': { nameLong: 'ETI*ÅTERTAGANDE*', nameShort: 'ETI*ÅTTA' },
            '4': { nameLong: 'ETI*ORIENTERING*', nameShort: 'ETI*ORI' }
        },
        '1': {
            nameShort: 'ERO',
            '0': { nameLong: 'ERO*1*',           nameShort: 'ERO*1' },
            '1': { nameLong: 'ERO*2*',           nameShort: 'ERO*2' },
            '2': { nameLong: 'ERO*ELDREGL*',     nameShort: 'ERO*ELDR' },
            '3': { nameLong: 'ESU*',             nameShort: 'ESU' },
            '4': { nameLong: 'ELD*UPPHÖR*',      nameShort: 'ELD*UPPH' },
            '5': { nameLong: 'INRIKTAD*',        nameShort: 'INRIKTAD' },
            '6': { nameLong: 'FYR*',             nameShort: 'FYR' },
            '7': { nameLong: 'SLUT*',            nameShort: 'SLUT' }
        },
        '2': {
            nameShort: 'RGI',
            '0': { nameLong: 'REGISTRERING*',    nameShort: 'RGI' },
            '1': { nameLong: 'RGI*RT*FLERA*MÅL', nameShort: 'RT*FLAMÅ' },
            '2': { nameLong: 'RGI*POL*FLER*MÅL', nameShort: 'PO*FL*MÅ' },
            '3': { nameLong: 'RGI*ELDBÄLTE*',    nameShort: 'RGI*ELDB' },
            '4': { nameLong: 'RGI*OPL',          nameShort: 'RGI*OPL' },
            '5': { nameLong: 'ELDORDER*',        nameShort: 'ELDORDER' },
            '6': { nameLong: 'AVREG*',           nameShort: 'AVREG' },
            '7': { nameLong: 'RAPPORT*REG*',     nameShort: 'RAPP*REG' }
        },
        '3': {
            nameShort: 'ARTUND',
            '0': { nameLong: 'ORD*LJUDMÄT*',     nameShort: 'ORD*LJM' },
            '1': { nameLong: 'SÖKOMRÅDE*',       nameShort: 'MÄTORDER' },
            '2': { nameLong: 'LJUDMÄT*MIKROFON', nameShort: 'LJ*MIK' },
            '3': { nameLong: 'MÅLRAPP*UND*',     nameShort: 'MÅLRAUND' },
            '4': { nameLong: 'LÅNGBAS*OPL*RAPP', nameShort: 'LÅNGBOPL' }
        },
        '4': {
            nameShort: 'REK',
            '0': { nameLong: 'Ö-REKORDER*',      nameShort: 'Ö-REKORD' },
            '1': { nameLong: 'Ö-REKRAPP*',       nameShort: 'Ö-REKRAP' },
            '2': { nameLong: 'D-REKORDER*',      nameShort: 'D-REKORD' },
            '3': { nameLong: 'GRUPPERINGSORDER', nameShort: 'GRPORDER' },
            '4': { nameLong: 'SNABBGRUPPERING*', nameShort: 'SNABBGRP' },
            '5': { nameLong: 'POS*BÄBEST*ORDER', nameShort: 'POSBÄORD' },
            '6': { nameLong: 'POS*BÄBEST*RAPP*', nameShort: 'POSBÄRAP' },
            '7': { nameLong: 'PJÄSPOSID*',       nameShort: 'PJÄSPOS' },
            '8': { nameLong: 'REK*LUFTOPL*',     nameShort: 'REK*LUFT' }
        },
        '5': {
            nameShort: 'ELDOMR',
            '0': { nameLong: 'ELDOMRÅDE*RT*',    nameShort: 'ELDO*RT' },
            '1': { nameLong: 'ELDOMRÅDE*CIRKEL', nameShort: 'ELDO*CIR' },
            '2': { nameLong: 'ELDOMRÅDE*GRÄNS*', nameShort: 'ELDO*GRÄ' },
            '3': { nameLong: 'ELDOMRÅDE*US*',    nameShort: 'ELDO*US' }
        },
        '6': {
            nameShort: 'MET',
            '0': { nameLong: 'HÖJDVÄRDEN*1*',    nameShort: 'HÖJDV*1' },
            '1': { nameLong: 'HÖJDVÄRDEN*2*',    nameShort: 'HÖJDV*1' },
            '2': { nameLong: 'ATMOSFÄRKORT*',    nameShort: 'ATMOSFÄR' }
        },
        '7': {
            nameShort: 'SKJUTGR',
            '0': { nameLong: 'SKJGR*RT*',        nameShort: 'SKJGR*CI' },
            '1': { nameLong: 'SKJGR*ZON*',       nameShort: 'SKJGR*ZO' },
            '2': { nameLong: 'SÄKOMR*EGEN*TRP*', nameShort: 'ELDO*GRÄ' }
        },
        '8': {
            nameShort: 'ÖVRIGT',
            '0': { nameLong: 'ORD*RAPP*BER',     nameShort: 'ORD*RABE' },
            '1': { nameLong: 'AMRAPP*ART*',      nameShort: 'AMRA*ART' },
            '2': { nameLong: 'FELMEDDELANDE*',   nameShort: 'FELMEDD' },
            '3': { nameLong: 'ELDTEKN*UNDERLAG', nameShort: 'ELDTELNU' }
        }
    },
    '5': {
        nameShort: 'UNDTJ',
        '0': {
            nameShort: 'UNDORDER',
            '0': { nameLong: 'SAMVERKAN*ORDER1', nameShort: 'SAMV*O*1' },
            '1': { nameLong: 'SAMVERKAN*ORDER2', nameShort: 'SAMV*O*2' },
            '2': { nameLong: 'S*ORDER*1-FAST-S', nameShort: 'S*ORD*1' },
            '3': { nameLong: 'S*ORDER*2-S-ÖVER', nameShort: 'S*ORD*2' },
            '4': { nameLong: 'S*ORDER*3-S-LNGS', nameShort: 'S*ORD*3' },
            '5': { nameLong: 'S*ORDER*4-OMRO-S', nameShort: 'S*ORD*4' },
            '6': { nameLong: 'S*ORDER*5-OLINJE', nameShort: 'S*ORD*5' }
        },
        '1': {
            nameShort: 'S-RAPP',
            '0': { nameLong: 'RAPP*ENLIGT*7*S*', nameShort: 'RAPP*7*S' },
            '1': { nameLong: 'RAPP*GEM*SYSS*1*', nameShort: 'RAPP*G*1' },
            '2': { nameLong: 'RAPP*GEM*SYSS*2*', nameShort: 'RAPP*G*2' },
            '3': { nameLong: 'RAPP*OLIK*SYSS*2', nameShort: 'RAPP*O*1' },
            '4': { nameLong: 'RAPP*OLIK*SYSS*2', nameShort: 'RAPP*O*2' },
            '5': { nameLong: 'RAPP*GRUPPERAD*1', nameShort: 'RAP*GRP1' },
            '6': { nameLong: 'RAPP*GRUPPERAD*1', nameShort: 'RAP*GRP2' },
            '7': { nameLong: 'RAPP*SAMMANFATTN', nameShort: 'RAPPSAMF' },
            '8': { nameLong: 'RAPP*LÄGE*',       nameShort: 'RAPP*LÄG' },
        }
    },
    '9': {
        nameShort: 'DYNAFORM',
        '9': {
            nameShort: 'DYNAFORM',
            '9': { nameLong: 'DYNAMISKT*FORMAT', nameShort: 'DYNAFORM' }
        }
    }
};