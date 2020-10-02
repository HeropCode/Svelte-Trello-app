<script>
  import Header from '~/components/Header.svelte'
  import ListContainer from '~/components/ListContainer.svelte'

  Object.assign(document.body.style, {
    backgroundColor: 'orange',
    backgroundImage: 'url(bg.jpg)',
    backgroundSize: 'cover'
  })
</script>

<Header />
<ListContainer />
