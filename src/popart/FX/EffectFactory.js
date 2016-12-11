import { RuttEtraCore,     RuttEtraDisplay }    from './RuttEtra/RuttEtra';
import RuttEtraController                       from './RuttEtra/RuttEtraController';
import { SynthesizerCore,  SynthesizerDisplay } from './Synthesizer/Synthesizer';
import SynthesizerController                    from './Synthesizer/SynthesizerController';
import { MosaicCore,  MosaicDisplay }           from './Mosaic/Mosaic';
import MosaicController                         from './Mosaic/MosaicController';
import { LEDCore,  LEDDisplay }                 from './LED/LED';
import LEDController                            from './LED/LEDController';
import { BlurCore,  BlurDisplay }               from './Blur/Blur';
import BlurController                           from './Blur/BlurController';
import { RGBSplitCore,  RGBSplitDisplay }       from './RGBSplit/RGBSplit';
import RGBSplitController                       from './RGBSplit/RGBSplitController';
import { PhotoStyleCore,  PhotoStyleDisplay }   from './PhotoStyle/PhotoStyle';
import PhotoStyleController                     from './PhotoStyle/PhotoStyleController';
import { FeedbackCore,  FeedbackDisplay }       from './Feedback/Feedback';
import FeedbackController                       from './Feedback/FeedbackController';
import { TrailsCore,  TrailsDisplay }           from './Trails/Trails';
import TrailsController                         from './Trails/TrailsController';

import LFO                                      from '../Modulators/LFO';
import LFOController                            from '../Modulators/LFOController';
import Sequencer                                from '../Modulators/Sequencer';
import SequencerController                      from '../Modulators/SequencerController';

var effectFactory = {
    lookupComponentByName: function(name) {
        let lookup = {
            'SynthesizerDisplay':    SynthesizerDisplay,
            'SynthesizerController': SynthesizerController,
            'SynthesizerCore':       SynthesizerCore,
            'RuttEtraDisplay':       RuttEtraDisplay,
            'RuttEtraController':    RuttEtraController,
            'RuttEtraCore':          RuttEtraCore,
            'MosaicDisplay':         MosaicDisplay,
            'MosaicController':      MosaicController,
            'MosaicCore':            MosaicCore,
            'LEDDisplay':            LEDDisplay,
            'LEDController':         LEDController,
            'LEDCore':               LEDCore,
            'BlurDisplay':           BlurDisplay,
            'BlurController':        BlurController,
            'BlurCore':              BlurCore,
            'RGBSplitDisplay':       RGBSplitDisplay,
            'RGBSplitController':    RGBSplitController,
            'RGBSplitCore':          RGBSplitCore,
            'PhotoStyleDisplay':     PhotoStyleDisplay,
            'PhotoStyleController':  PhotoStyleController,
            'PhotoStyleCore':        PhotoStyleCore,
            'FeedbackDisplay':       FeedbackDisplay,
            'FeedbackController':    FeedbackController,
            'FeedbackCore':          FeedbackCore,
            'TrailsDisplay':         TrailsDisplay,
            'TrailsController':      TrailsController,
            'TrailsCore':            TrailsCore,

            'LFO':                   LFO,
            'LFOController':         LFOController,
            'Sequencer':             Sequencer,
            'SequencerController':   SequencerController,
        };

        return lookup[name];
    }
};

export default effectFactory;
