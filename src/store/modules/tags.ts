import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { Route } from 'vue-router';
import store from '@/store';

export interface ITagView extends Partial<Route> {
  title?: string;
  name?: any;
}

export interface ITagsViewState {
  visitedViews: ITagView[];
}

@Module({ dynamic: true, store, name: 'tagsView' })
class TagsView extends VuexModule implements ITagsViewState {
  public visitedViews: ITagView[] = [];
  public cachedViews: (string | undefined)[] = [];

  @Mutation
  private ADD_VISITED_VIEW(view: ITagView) {
    if (
      this.visitedViews.some((v) => {
        return v.path === view.path;
      })
    )
      return;
    this.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name',
      }),
    );
  }

  @Mutation
  private DEL_ALL_VISITED_VIEWS() {
    // keep affix tags
    const affixTags = this.visitedViews.filter((tag) => tag.meta.affix);
    this.visitedViews = affixTags;
  }

  @Mutation
  private UPDATE_VISITED_VIEW(view: ITagView) {
    for (let v of this.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }
  @Mutation
  private DEL_VISITED_VIEW(view: ITagView) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1);
      }
    }
  }

  @Action
  public addView(view: ITagView) {
    this.ADD_VISITED_VIEW(view);
  }
  @Action
  public delView(view: ITagView) {
    this.DEL_VISITED_VIEW(view);
  }

  @Action
  public delAllViews() {
    this.DEL_ALL_VISITED_VIEWS();
  }

  @Action
  public updateVisitedView(view: ITagView) {
    this.UPDATE_VISITED_VIEW(view);
  }
}
export const TagsViewModule = getModule(TagsView);
