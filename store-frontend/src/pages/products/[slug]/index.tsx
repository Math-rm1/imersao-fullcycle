import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import http from '../../../config/http';
import { Product } from '../../../models/models';

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Head>
        <title>{product.name} - Detalhes do produto</title>
        {/* <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`R$ ${product.price}`}
        />
        <CardActions>
          <Link
            href='/products/[slug]/order'
            as={`/products/${product.slug}/order`}
            passHref
          >
            <Button size='small' color='primary' component='a'>
              Comprar
            </Button>
          </Link>
        </CardActions>
        <CardMedia
          style={{ paddingTop: '56%' }}
          image={product.image_url}
          title={product.name}
        />
        <CardContent>
          <Typography component='p' variant='body2' color='textSecondary'>
            {product.description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;

export const getStaticProps: GetStaticProps<
  ProductDetailPageProps,
  { slug: string }
> = async (contexto) => {
  const { slug } = contexto.params!;
  try {
    const { data: product } = await http.get(`products/${slug}`);
    return {
      props: {
        product,
      },
      revalidate: 1 * 60 * 2,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    }
    throw e;
  }
};

export const getStaticPaths: GetStaticPaths = async (contexto) => {
  const { data: products } = await http.get('products');

  const paths = products.map((product: Product) => ({
    params: { slug: product.slug },
  }));

  return { paths, fallback: 'blocking' };
};
