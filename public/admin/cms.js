/* global CMS, createClass, h */

(function () {
  if (!window.CMS) return;

  CMS.registerPreviewStyle('/admin/preview.css');

  var ArticlePreview = createClass({
    render: function () {
      var entry = this.props.entry;

      var title = entry.getIn(['data', 'title']) || '';
      var snippet = entry.getIn(['data', 'snippet']) || '';
      var author = entry.getIn(['data', 'author']) || '';
      var pubDate = entry.getIn(['data', 'pubDate']) || '';
      var coverAlt = entry.getIn(['data', 'coverAlt']) || '';

      var cover = entry.getIn(['data', 'cover']);
      var coverAsset = cover ? this.props.getAsset(cover) : null;
      var coverSrc = coverAsset ? coverAsset.toString() : '';

      var metaParts = [];
      if (pubDate) metaParts.push(pubDate.toString());
      if (author) metaParts.push(author);

      return h(
        'article',
        { className: 'decap-preview' },
        coverSrc
          ? h('img', {
              src: coverSrc,
              alt: coverAlt,
              className: 'decap-preview__cover',
              loading: 'lazy',
            })
          : null,
        h('h1', { className: 'decap-preview__title' }, title),
        snippet ? h('p', { className: 'decap-preview__snippet' }, snippet) : null,
        metaParts.length
          ? h('p', { className: 'decap-preview__meta' }, metaParts.join(' • '))
          : null,
        h('div', { className: 'decap-preview__body' }, this.props.widgetFor('body'))
      );
    },
  });

  CMS.registerPreviewTemplate('articles', ArticlePreview);
})();
