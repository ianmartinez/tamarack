/**
 * We'll use a TkController to manage data bindings and
 * other interactions between a view and a model.
 * 
 * TODO: Everything (^__^)
 */
class TkController {

    constructor(model, view) {
        this.model = new TkModel(model);
        this.view = view;
    }

}

/**
 * Usually not invoked directly, but used 
 * internally by TkController to wrap objects in.
 */
class TkModel {
    
    constructor(object) {
        this.value = object;
    }

}