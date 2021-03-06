const db = {
    categories: [
        {
            name: 'Generators',
            isEffect: true,
            items: [
                { name: 'Synthesizer', description: 'Generate patterns using maths functions' }
            ]
        },

        {
            name: 'Effects',
            isEffect: true,
            items: [
                { name: 'RuttEtra', description: 'Horizontal lines based on pixel brightness'   },
                { name: 'Mosaic',   description: 'Repeat an image multiple times'                      },
                { name: 'LED',      description: 'Repeated circular shapes'                     },
                { name: 'Blur',     description: 'Gaussian blur'                                       },
                { name: 'RGBSplit', description: 'Split and draw color channels at separate positions' },
                { name: 'PhotoStyle', description: 'Stylish photo filters' },
                { name: 'Feedback', description: 'Naive motion blur' },
                { name: 'Trails',   description: 'Generate trails on moving patterns' },
                { name: 'Rotater',   description: 'Rotate viewport' },
            ]
        },

        {
            name: 'Modulators',
            isEffect: false,
            items: [
                { name: 'LFO',       description: 'Automate parameters using Low Frequency Oscilators' },
                { name: 'Sequencer', description: 'Step sequencer for automation'                      },
                { name: 'Macro',     description: 'Meta parameters controller'                         },
            ]
        }
    ]
}

export default db;
