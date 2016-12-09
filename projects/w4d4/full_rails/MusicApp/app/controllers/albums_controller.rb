class AlbumsController < ApplicationController
  def index
    @band = Band.find_by(id: params[:band_id])
    @albums = @band.albums
  end

  def new
    @band = Band.find_by(id: params[:band_id])
  end

  def show
    @album = Album.find_by(id: params[:id])
  end

  def create
    album = Album.new(album_params)
    if album.save
      redirect_to album_url(album)
    else
      flash[:errors] = album.errors.full_messages
      render :new
    end
  end

  def edit
  end

  private

  def album_params
    params.require(:album).permit(:title, :band_id, :recording_type)
  end
end