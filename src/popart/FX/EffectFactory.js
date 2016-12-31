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
import { RotaterCore,  RotaterDisplay }         from './Rotater/Rotater';
import RotaterController                        from './Rotater/RotaterController';

import LFO                                      from '../Modulators/LFO';
import LFOController                            from '../Modulators/LFOController';
import Sequencer                                from '../Modulators/Sequencer';
import SequencerController                      from '../Modulators/SequencerController';
import Macro                                    from '../Modulators/Macro';
import MacroController                          from '../Modulators/MacroController';

const classes = {
    SynthesizerDisplay,
    SynthesizerController,
    SynthesizerCore,
    RuttEtraDisplay,
    RuttEtraController,
    RuttEtraCore,
    MosaicDisplay,
    MosaicController,
    MosaicCore,
    LEDDisplay,
    LEDController,
    LEDCore,
    BlurDisplay,
    BlurController,
    BlurCore,
    RGBSplitDisplay,
    RGBSplitController,
    RGBSplitCore,
    PhotoStyleDisplay,
    PhotoStyleController,
    PhotoStyleCore,
    FeedbackDisplay,
    FeedbackController,
    FeedbackCore,
    TrailsDisplay,
    TrailsController,
    TrailsCore,
    RotaterDisplay,
    RotaterController,
    RotaterCore,

    LFO,
    LFOController,
    Sequencer,
    SequencerController,
    Macro,
    MacroController,
};

var effectFactory = {
    lookupComponentByName: function(name) {
        return classes[name];
    }
};

export default effectFactory;
